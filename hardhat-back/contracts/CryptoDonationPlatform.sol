// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;


contract NGOFunding {
    address public owner;
    uint256 constant VOTING_PERIOD = 7 days;
    // uint256 constant REFUND_WINDOW = 90 days;
    uint256 constant VOTER_REWARD_PERCENTAGE = 5;
    uint256 constant VOTING_THRESHOLD = 50;

    struct NGO {
        string name;
        string description;
        uint256 stakedEth;
        string logo;
        uint256[] taskIds;
    }

    struct Voter {
        uint256 stakedEth;
        mapping(uint256 => bool) hasVoted;
    }

    struct Task {
        string name;
        string  description;
        address ngo;
        string[] proofLinks;
        string status; // "pending", "approved", "rejected"
        uint256 yesVotes;
        uint256 noVotes;
        uint256 totalFunds;
        uint256 startTime;
        mapping(address => bool) voters;
        uint256 voterCount;
    }

    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }

    struct TaskDetails {
        uint256 taskId; 
        string description;
        string[] proofLinks; 
    }

    struct NGOWithTasks {
        uint256 id; 
        string name;
        string description;
        TaskDetails[] tasks;
    }

    mapping(address => NGO) public ngos; 
    mapping(address => Voter) public voters; 
    mapping(uint256 => Task) public tasks; 
    mapping(uint256 => Donation[]) public taskDonations; 
    uint256 public taskCounter;
    address[] public ngoList;


    event NGOStakeWithdrawn(address ngo, uint256 amount);
    // event NGORegistered(address ngo, string name);
    // event VoterRegistered(address voter, uint256 stakedEth);
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

    function registerNGO(string memory _name, string memory _description, string memory _logo) external payable {
        require(msg.value > 10000000000000000, "Must stake ETH");
        require(ngos[msg.sender].stakedEth == 0, "NGO already registered");
        ngos[msg.sender] = NGO({
            name: _name,
            description: _description,
            stakedEth: msg.value,
            taskIds: new uint256[](0),
            logo : _logo
        });
        ngoList.push(msg.sender);
        // emit NGORegistered(msg.sender, _name);
    }

    function registerVoter() external payable {
        require(msg.value > 0, "Must stake ETH");
        require(voters[msg.sender].stakedEth == 0, "Already a voter"); 


        voters[msg.sender].stakedEth = msg.value;
        // emit VoterRegistered(msg.sender, msg.value);
    }

    function createTask(string[] memory _proofLinks, string memory _name, string memory _description ) external {
        require(ngos[msg.sender].stakedEth > 0, "NGO not registered"); //NGO must be registered

        taskCounter++;
        Task storage newTask = tasks[taskCounter];
        newTask.ngo = msg.sender;
        newTask.proofLinks = _proofLinks;
        newTask.status = "pending";
        newTask.startTime = block.timestamp;
        newTask.name = _name;
        newTask.description = _description;

        ngos[msg.sender].taskIds.push(taskCounter);
        emit TaskCreated(taskCounter, msg.sender);
    }

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

    function resolveTask(uint256 _taskId) external {
        Task storage task = tasks[_taskId];
        require(task.ngo != address(0), "Task does not exist");
        require(keccak256(bytes(task.status)) == keccak256(bytes("pending")), "Task already resolved");
        require(block.timestamp > task.startTime + VOTING_PERIOD, "Voting period not ended");

        uint256 voterRewardPool = task.voterCount > 0 ? (task.totalFunds * VOTER_REWARD_PERCENTAGE) / 100 : 0;
        uint256 remainingFunds = task.totalFunds - voterRewardPool;

        uint256 totalVotes = task.yesVotes + task.noVotes;
        if (totalVotes > 0 && (task.yesVotes * 100 / totalVotes) >= VOTING_THRESHOLD) {
            task.status = "approved";
            (bool sentNgo, ) = task.ngo.call{value: remainingFunds}("");
            require(sentNgo, "Failed to send funds to NGO");
        } else {
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

    function withdrawVoterStake() external payable {
        require(voters[msg.sender].stakedEth > 0, "Not a voter");
        uint256 amount = voters[msg.sender].stakedEth;
        voters[msg.sender].stakedEth = 0;
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Withdrawal failed");
        delete voters[msg.sender];
    }

    function withdrawNgoStake() external payable  {
        require(ngos[msg.sender].stakedEth > 0, "Not an NGO or already withdrawn");

        NGO storage ngo = ngos[msg.sender];
        for (uint256 i = 0; i < ngo.taskIds.length; i++) {
            Task storage task = tasks[ngo.taskIds[i]];
            if (keccak256(bytes(task.status)) == keccak256(bytes("pending")) &&
                block.timestamp <= task.startTime + VOTING_PERIOD) {
                revert("Cannot withdraw with pending tasks");
            }
        }

        uint256 amount = ngo.stakedEth;
        ngo.stakedEth = 0; 
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Withdrawal failed");
        delete ngos[msg.sender];

        emit NGOStakeWithdrawn(msg.sender, amount);
    }

    function claimVoterReward(uint256 _taskId) external {
        require(tasks[_taskId].voters[msg.sender], "Did not vote on task");
        require(keccak256(bytes(tasks[_taskId].status)) != keccak256(bytes("pending")), "Task still pending");

        uint256 voterRewardPool = (tasks[_taskId].totalFunds * VOTER_REWARD_PERCENTAGE) / 100;
        uint256 reward = tasks[_taskId].voterCount > 0 ? voterRewardPool / tasks[_taskId].voterCount : 0;

        (bool sent, ) = msg.sender.call{value: reward}("");
        require(sent, "Reward claim failed");

        tasks[_taskId].voters[msg.sender] = false;
    }

    function adminWithdraw(address ngoAdd) external onlyOwner{
        require(ngos[ngoAdd].stakedEth > 0, "Not an NGO or already withdrawn");

        NGO storage ngo = ngos[ngoAdd];
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

    function getAllNGOs() external view returns (address[] memory) {
        return ngoList;

    }

    function getNGODetails(address _ngo) external view returns (
        string memory name,
        string memory description,
        uint256 stakedEth,
        uint256[] memory taskIds,
        string memory logo
    ) {
        NGO storage ngo = ngos[_ngo];
        require(ngo.stakedEth > 0, "NGO not registered");
        return (ngo.name, ngo.description, ngo.stakedEth, ngo.taskIds, ngo.logo);
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
        uint256 voterCount,
        string memory name,
        string memory taskDescription
    ) {
        Task storage task = tasks[_taskId];
        require(task.ngo != address(0), "Task does not exist");
        return (task.ngo, task.proofLinks, task.status, task.yesVotes, task.noVotes, task.totalFunds, task.startTime, task.voterCount, task.name , task.description);
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

    function getAllNGOsWithTasks() external view returns (NGOWithTasks[] memory) {
        NGOWithTasks[] memory result = new NGOWithTasks[](ngoList.length);


        for (uint256 i = 0; i < ngoList.length; i++) {
            address ngoAddress = ngoList[i];
            NGO storage ngo = ngos[ngoAddress];


            TaskDetails[] memory taskDetails = new TaskDetails[](ngo.taskIds.length);
            for (uint256 j = 0; j < ngo.taskIds.length; j++) {
                uint256 taskId = ngo.taskIds[j];
                Task storage task = tasks[taskId];
                taskDetails[j] = TaskDetails({
                    taskId: taskId, // Used as a placeholder for title (e.g., "Task #1")
                    description: task.description,
                    proofLinks: task.proofLinks
                });
            }

            result[i] = NGOWithTasks({
                id: i + 1,
                name: ngo.name,
                description: ngo.description,
                tasks: taskDetails
            });
        }

        return result;
    }
}
