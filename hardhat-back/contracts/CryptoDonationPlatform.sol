// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;


contract NGOFunding {
    address public owner; // You, the admin, for now
    uint256 constant VOTING_PERIOD = 7 days; // Voting period
    uint256 constant REFUND_WINDOW = 90 days; // Refund window
    uint256 constant VOTER_REWARD_PERCENTAGE = 5; // 5% of funds for voters
    uint256 constant VOTING_THRESHOLD = 50; // 50% approval threshold


    // Structs for storing data
    struct NGO {
        string name;
        string description;
        uint256 stakedEth;
        uint256[] taskIds; // Task history
    }


    struct Voter {
        uint256 stakedEth;
        mapping(uint256 => bool) hasVoted; // Tracks votes per task
    }


    struct Task {
        address ngo;
        string[] proofLinks; // Cloudinary links
        string status; // "pending", "approved", "rejected"
        uint256 yesVotes;
        uint256 noVotes;
        uint256 totalFunds;
        uint256 startTime;
        mapping(address => bool) voters; // Who voted
        uint256 voterCount; // Total voters for reward splitting
    }


    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }


    // Mappings and counters
    mapping(address => NGO) public ngos;  //NGO wallet Address -> NGO
    mapping(address => Voter) public voters; //Voter wallet Address-> Voter
    mapping(uint256 => Task) public tasks; //Task_id -> Task
    mapping(uint256 => Donation[]) public taskDonations; // Task ID => Donations
    uint256 public taskCounter;
    address[] public ngoList; // Array to track all NGOs
    event NGOStakeWithdrawn(address ngo, uint256 amount);


    // Events
    event NGORegistered(address ngo, string name);
    event VoterRegistered(address voter, uint256 stakedEth);
    event TaskCreated(uint256 taskId, address ngo);
    event Donated(uint256 taskId, address donor, uint256 amount, uint256 donationId);
    event Voted(uint256 taskId, address voter, bool vote);
    event TaskResolved(uint256 taskId, string status);


    constructor() {
        owner = msg.sender;
    }


    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }


    // 1. NGO Registration
    function registerNGO(string memory _name, string memory _description) external payable {
        require(msg.value > 0, "Must stake ETH"); //minimum stack amount validation
        require(ngos[msg.sender].stakedEth == 0, "NGO already registered");  // IF stacked etr is 0 then not registered


        ngos[msg.sender] = NGO({
            name: _name,
            description: _description,
            stakedEth: msg.value,
            taskIds: new uint256[](0)
        });


        ngoList.push(msg.sender); // added to all NGO


        emit NGORegistered(msg.sender, _name);
    }


    // 2. Voter Registration
    function registerVoter() external payable {
        require(msg.value > 0, "Must stake ETH"); //minimum stack eth validation
        require(voters[msg.sender].stakedEth == 0, "Already a voter"); //If stacked etr is 0 then not voter


        voters[msg.sender].stakedEth = msg.value;
        emit VoterRegistered(msg.sender, msg.value);
    }


    // 3. Task Creation
    function createTask(string[] memory _proofLinks) external {
        require(ngos[msg.sender].stakedEth > 0, "NGO not registered"); //NGO must be registered


        taskCounter++; //increment TaskNo
        Task storage newTask = tasks[taskCounter];
        newTask.ngo = msg.sender;
        newTask.proofLinks = _proofLinks;
        newTask.status = "pending";
        newTask.startTime = block.timestamp;


        ngos[msg.sender].taskIds.push(taskCounter); //store task to ngo's struct
        emit TaskCreated(taskCounter, msg.sender);
    }


    // 4. Donation
    function donate(uint256 _taskId) external payable {
        require(tasks[_taskId].ngo != address(0), "Task does not exist"); //task validation
        require(msg.value > 0, "Must donate ETH");  //must to donate etr
        require(keccak256(bytes(tasks[_taskId].status)) == keccak256(bytes("pending")), "Task not pending"); //task status must be pending to donate etr


        tasks[_taskId].totalFunds += msg.value;
        taskDonations[_taskId].push(Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        }));


        emit Donated(_taskId, msg.sender, msg.value, taskDonations[_taskId].length - 1);
    }


    // 5. Voting
    function vote(uint256 _taskId, bool _approve) external {
        require(voters[msg.sender].stakedEth > 0, "Not a voter"); //must be voter
        require(tasks[_taskId].ngo != address(0), "Task does not exist"); //task musut be exsist
        require(!voters[msg.sender].hasVoted[_taskId], "Already voted"); // voter must not voted prior
        require(keccak256(bytes(tasks[_taskId].status)) == keccak256(bytes("pending")), "Task not pending"); //Task must be in panding state
        require(block.timestamp <= tasks[_taskId].startTime + VOTING_PERIOD, "Voting period ended"); //vote before voting period


        voters[msg.sender].hasVoted[_taskId] = true;
        tasks[_taskId].voters[msg.sender] = true;
        tasks[_taskId].voterCount++;


        if (_approve) {
            tasks[_taskId].yesVotes++;
        } else {
            tasks[_taskId].noVotes++;
        }


        emit Voted(_taskId, msg.sender, _approve);
    }


    // 6 & 7. Resolve Task (Voters rewarded regardless of outcome)
    function resolveTask(uint256 _taskId) external {
        Task storage task = tasks[_taskId];
        require(task.ngo != address(0), "Task does not exist");
        require(keccak256(bytes(task.status)) == keccak256(bytes("pending")), "Task already resolved");
        require(block.timestamp > task.startTime + VOTING_PERIOD, "Voting period not ended");


        // Calculate voter reward pool first (always reserved)
        uint256 voterRewardPool = task.voterCount > 0 ? (task.totalFunds * VOTER_REWARD_PERCENTAGE) / 100 : 0;
        uint256 remainingFunds = task.totalFunds - voterRewardPool;


        uint256 totalVotes = task.yesVotes + task.noVotes;
        if (totalVotes > 0 && (task.yesVotes * 100 / totalVotes) >= VOTING_THRESHOLD) {
            // Approved: Send remaining funds to NGO
            task.status = "approved";
            (bool sentNgo, ) = task.ngo.call{value: remainingFunds}("");
            require(sentNgo, "Failed to send funds to NGO");
        } else {
            // Rejected: Refund donors with remaining funds
            task.status = "rejected";
            uint256 totalDonated = 0;
            for (uint256 i = 0; i < taskDonations[_taskId].length; i++) {
                totalDonated += taskDonations[_taskId][i].amount;
            }
            for (uint256 i = 0; i < taskDonations[_taskId].length; i++) {
                Donation memory donation = taskDonations[_taskId][i];
                uint256 refundAmount = (donation.amount * remainingFunds) / totalDonated; // Proportional refund
                (bool sent, ) = donation.donor.call{value: refundAmount}("");
                require(sent, "Refund failed");
            }
        }


        emit TaskResolved(_taskId, task.status);
    }


    // 8. Voter Withdrawal
    function withdrawVoterStake() external {
        require(voters[msg.sender].stakedEth > 0, "Not a voter");


        uint256 amount = voters[msg.sender].stakedEth;
        voters[msg.sender].stakedEth = 0;
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Withdrawal failed");
    }


    function withdrawNgoStake() external {
        require(ngos[msg.sender].stakedEth > 0, "Not an NGO or already withdrawn");


        // Check for pending tasks
        NGO storage ngo = ngos[msg.sender];
        for (uint256 i = 0; i < ngo.taskIds.length; i++) {
            Task storage task = tasks[ngo.taskIds[i]];
            if (keccak256(bytes(task.status)) == keccak256(bytes("pending")) &&
                block.timestamp <= task.startTime + VOTING_PERIOD) {
                revert("Cannot withdraw with pending tasks");
            }
        }


        uint256 amount = ngo.stakedEth;
        ngo.stakedEth = 0; // Reset stake
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Withdrawal failed");


        emit NGOStakeWithdrawn(msg.sender, amount);
    }


    // Helper: Claim voter rewards (Available even if rejected)
    function claimVoterReward(uint256 _taskId) external {
        require(tasks[_taskId].voters[msg.sender], "Did not vote on task");
        require(keccak256(bytes(tasks[_taskId].status)) != keccak256(bytes("pending")), "Task still pending");


        uint256 voterRewardPool = (tasks[_taskId].totalFunds * VOTER_REWARD_PERCENTAGE) / 100;
        uint256 reward = tasks[_taskId].voterCount > 0 ? voterRewardPool / tasks[_taskId].voterCount : 0;


        (bool sent, ) = msg.sender.call{value: reward}("");
        require(sent, "Reward claim failed");


        tasks[_taskId].voters[msg.sender] = false; // Prevent double claim
    }


    // Getter Functions
    function getAllNGOs() external view returns (address[] memory) {
        return ngoList;
    }


    function getNGODetails(address _ngo) external view returns (
        string memory name,
        string memory description,
        uint256 stakedEth,
        uint256[] memory taskIds
    ) {
        NGO storage ngo = ngos[_ngo];
        require(ngo.stakedEth > 0, "NGO not registered");
        return (ngo.name, ngo.description, ngo.stakedEth, ngo.taskIds);
    }


    function getNGOTaskStatuses(address _ngo) external view returns (uint256[] memory taskIds, string[] memory statuses) {
        NGO storage ngo = ngos[_ngo];
        require(ngo.stakedEth > 0, "NGO not registered");


        taskIds = ngo.taskIds;
        statuses = new string[](taskIds.length);


        for (uint256 i = 0; i < taskIds.length; i++) {
            statuses[i] = tasks[taskIds[i]].status;
        }


        return (taskIds, statuses);
    }


    function getAllTasks() external view returns (uint256[] memory) {
        uint256[] memory allTasks = new uint256[](taskCounter);
        for (uint256 i = 1; i <= taskCounter; i++) {
            allTasks[i - 1] = i;
        }
        return allTasks;
    }


    function getTaskDetails(uint256 _taskId) external view returns (
        address ngo,
        string[] memory proofLinks,
        string memory status,
        uint256 yesVotes,
        uint256 noVotes,
        uint256 totalFunds,
        uint256 startTime,
        uint256 voterCount
    ) {
        Task storage task = tasks[_taskId];
        require(task.ngo != address(0), "Task does not exist");
        return (task.ngo, task.proofLinks, task.status, task.yesVotes, task.noVotes, task.totalFunds, task.startTime, task.voterCount);
    }


    function getVoterDetails(address _voter) external view returns (uint256 stakedEth) {
        return voters[_voter].stakedEth;
    }


    function hasVoted(address _voter, uint256 _taskId) external view returns (bool) {
        return voters[_voter].hasVoted[_taskId];
    }


    function getDonations(uint256 _taskId) external view returns (Donation[] memory) {
        return taskDonations[_taskId];
    }


    function getNGOTotalFunds(address _ngo) external view returns (uint256 totalFunds) {
        NGO storage ngo = ngos[_ngo];
        require(ngo.stakedEth > 0, "NGO not registered");


        totalFunds = 0;
        for (uint256 i = 0; i < ngo.taskIds.length; i++) {
            if (keccak256(bytes(tasks[ngo.taskIds[i]].status)) == keccak256(bytes("approved"))) {
                totalFunds += tasks[ngo.taskIds[i]].totalFunds;
            }
        }
        return totalFunds;
    }


    function getPendingTasks() external view returns (uint256[] memory) {
        uint256 pendingCount = 0;
        for (uint256 i = 1; i <= taskCounter; i++) {
            if (keccak256(bytes(tasks[i].status)) == keccak256(bytes("pending")) &&
                block.timestamp <= tasks[i].startTime + VOTING_PERIOD) {
                pendingCount++;
            }
        }


        uint256[] memory pendingTasks = new uint256[](pendingCount);
        uint256 index = 0;
        for (uint256 i = 1; i <= taskCounter; i++) {
            if (keccak256(bytes(tasks[i].status)) == keccak256(bytes("pending")) &&
                block.timestamp <= tasks[i].startTime + VOTING_PERIOD) {
                pendingTasks[index] = i;
                index++;
            }
        }
        return pendingTasks;
    }
}
