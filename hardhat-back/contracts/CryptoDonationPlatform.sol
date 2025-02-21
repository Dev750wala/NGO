// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CryptoDonationPlatform is Ownable, ReentrancyGuard {
    IERC20 public governanceToken; // Governance token (optional, for compatibility)
    uint256 public voteThreshold;  // Votes needed to verify funds
    uint256 public minStake;       // Minimum ETH to stake to become a voter
    uint256 public voteReward;     // ETH reward per vote

    // Structs
    struct Donation {
        address donor;
        uint256 amount;
        uint256 ngoId;
        bool isVerified;
        bool isReleased;
        string proofHash;
        uint256 timestamp;
    }

    struct NGO {
        address wallet;
        string name;
        bool isVerified;
    }

    struct Voter {
        uint256 stakedAmount; // Amount of ETH staked
        bool isActive;        // Whether they are an active voter
    }

    // Mappings
    mapping(uint256 => NGO) public ngos;
    mapping(uint256 => Donation) public donations;
    mapping(address => uint256[]) public donorDonations;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => uint256) public voteCount;
    mapping(address => Voter) public voters; // Voter address -> Voter details
    uint256 public ngoCount;
    uint256 public donationCount;
    uint256 public totalStaked;      // Total ETH staked by voters
    uint256 public rewardPool;       // ETH available for voter rewards
    uint256 public constant DEADLINE = 90 days;

    // Events
    event NGORegistered(uint256 ngoId, address wallet, string name);
    event DonationMade(uint256 donationId, address donor, uint256 ngoId, uint256 amount);
    event ProofSubmitted(uint256 donationId, string proofHash);
    event VoteCast(uint256 donationId, address voter, uint256 voteCount);
    event FundsVerified(uint256 donationId);
    event FundsReleased(uint256 donationId, address ngoWallet, uint256 amount);
    event FundsRefunded(uint256 donationId, address donor, uint256 amount);
    event VoterStaked(address voter, uint256 amount);
    event VoterWithdrawn(address voter, uint256 amount);
    event VoterSlashed(address voter, uint256 amount);
    event RewardDistributed(address voter, uint256 amount);

    // Constructor
    constructor(address _governanceToken, uint256 _voteThreshold, uint256 _minStake, uint256 _voteReward) 
        Ownable(msg.sender) 
    {
        require(_governanceToken != address(0), "Invalid token address");
        require(_voteThreshold > 0, "Vote threshold must be greater than 0");
        require(_minStake > 0, "Minimum stake must be greater than 0");
        governanceToken = IERC20(_governanceToken);
        voteThreshold = _voteThreshold;
        minStake = _minStake;
        voteReward = _voteReward;
    }

    // Stake ETH to become a voter
    function stake() external payable nonReentrant {
        require(msg.value >= minStake, "Stake amount too low");
        require(!voters[msg.sender].isActive, "Already a voter");

        voters[msg.sender] = Voter({
            stakedAmount: msg.value,
            isActive: true
        });
        totalStaked += msg.value;

        emit VoterStaked(msg.sender, msg.value);
    }

    // Withdraw stake (only if active and no misbehavior)
    function withdrawStake() external nonReentrant {
        Voter storage voter = voters[msg.sender];
        require(voter.isActive, "Not an active voter");
        require(voter.stakedAmount > 0, "No stake to withdraw");

        uint256 amount = voter.stakedAmount;
        voter.stakedAmount = 0;
        voter.isActive = false;
        totalStaked -= amount;

        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send ETH");

        emit VoterWithdrawn(msg.sender, amount);
    }

    // Register an NGO (admin-controlled for now)
    function registerNGO(address _wallet, string memory _name) external onlyOwner {
        require(_wallet != address(0), "Invalid wallet address");
        ngoCount++;
        ngos[ngoCount] = NGO({
            wallet: _wallet,
            name: _name,
            isVerified: true
        });
        emit NGORegistered(ngoCount, _wallet, _name);
    }

    // Donate to an NGO (part of donation can fund reward pool)
    function donate(uint256 _ngoId) external payable nonReentrant {
        require(msg.value > 0, "Donation amount must be greater than 0");
        require(ngos[_ngoId].isVerified, "NGO not verified");

        // Allocate 2% of donation to reward pool (adjustable)
        uint256 rewardContribution = msg.value / 50; // 2%
        rewardPool += rewardContribution;
        uint256 donationAmount = msg.value - rewardContribution;

        donationCount++;
        donations[donationCount] = Donation({
            donor: msg.sender,
            amount: donationAmount,
            ngoId: _ngoId,
            isVerified: false,
            isReleased: false,
            proofHash: "",
            timestamp: block.timestamp
        });

        donorDonations[msg.sender].push(donationCount);
        emit DonationMade(donationCount, msg.sender, _ngoId, donationAmount);
    }

    // NGO submits proof
    function submitProof(uint256 _donationId, string memory _proofHash) external {
        Donation storage donation = donations[_donationId];
        require(donation.ngoId > 0, "Donation does not exist");
        require(msg.sender == ngos[donation.ngoId].wallet, "Only NGO can submit proof");
        require(!donation.isVerified, "Already verified");
        require(bytes(_proofHash).length > 0, "Proof hash cannot be empty");

        donation.proofHash = _proofHash;
        emit ProofSubmitted(_donationId, _proofHash);
    }

    // Voters vote to verify funds and receive reward
    function voteToVerify(uint256 _donationId) external nonReentrant {
        Voter storage voter = voters[msg.sender];
        Donation storage donation = donations[_donationId];
        require(voter.isActive, "Not an active voter");
        require(donation.ngoId > 0, "Donation does not exist");
        require(!donation.isVerified, "Already verified");
        require(bytes(donation.proofHash).length > 0, "Proof not submitted");
        require(!hasVoted[_donationId][msg.sender], "Already voted");

        hasVoted[_donationId][msg.sender] = true;
        voteCount[_donationId]++;

        // Distribute reward if available
        if (rewardPool >= voteReward) {
            rewardPool -= voteReward;
            (bool sent, ) = msg.sender.call{value: voteReward}("");
            require(sent, "Failed to send reward");
            emit RewardDistributed(msg.sender, voteReward);
        }

        emit VoteCast(_donationId, msg.sender, voteCount[_donationId]);

        if (voteCount[_donationId] >= voteThreshold) {
            donation.isVerified = true;
            emit FundsVerified(_donationId);
        }
    }

    // Release funds to NGO
    function releaseFunds(uint256 _donationId) external nonReentrant {
        Donation storage donation = donations[_donationId];
        require(donation.isVerified, "Funds not verified");
        require(!donation.isReleased, "Funds already released");

        donation.isReleased = true;
        address ngoWallet = ngos[donation.ngoId].wallet;
        uint256 amount = donation.amount;

        (bool sent, ) = ngoWallet.call{value: amount}("");
        require(sent, "Failed to send funds");

        emit FundsReleased(_donationId, ngoWallet, amount);
    }

    // Refund donor if deadline passes
    function refundDonation(uint256 _donationId) external nonReentrant {
        Donation storage donation = donations[_donationId];
        require(donation.donor == msg.sender, "Only donor can request refund");
        require(!donation.isVerified && !donation.isReleased, "Cannot refund");
        require(block.timestamp >= donation.timestamp + DEADLINE, "Deadline not reached");

        donation.isReleased = true;
        uint256 amount = donation.amount;

        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send refund");

        emit FundsRefunded(_donationId, msg.sender, amount);
    }

    // Slash voter for miscellaneous activity (admin  only for now)
    function slashVoter(address _voter) external onlyOwner {
        Voter storage voter = voters[_voter];
        require(voter.isActive, "Not an active voter");
        require(voter.stakedAmount > 0, "No stake to slash");

        uint256 amount = voter.stakedAmount;
        voter.stakedAmount = 0;
        voter.isActive = false;
        totalStaked -= amount;

        // Stake is forfeited to the contract (could be sent elsewhere)
        emit VoterSlashed(_voter, amount);
    }

    // Fund reward pool (optional, for external contributions)
    function fundRewardPool() external payable {
        rewardPool += msg.value;
    }

    // View functions
    function getVoterDetails(address _voter) external view returns (Voter memory) {
        return voters[_voter];
    }

    function getDonorDonations(address _donor) external view returns (uint256[] memory) {
        return donorDonations[_donor];
    }

    function getDonationDetails(uint256 _donationId) external view returns (Donation memory) {
        return donations[_donationId];
    }

    function getNGODetails(uint256 _ngoId) external view returns (NGO memory) {
        return ngos[_ngoId];
    }

    function getVoteCount(uint256 _donationId) external view returns (uint256) {
        return voteCount[_donationId];
    }
}