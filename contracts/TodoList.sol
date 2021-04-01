pragma solidity ^0.5.0;

contract TodoList {
    uint256 public taskCount = 0;

    struct Task {
        uint256 id;
        string content;
        bool done;
    }

    event TaskCompleted(uint256 id, bool done);
    mapping(uint256 => Task) public tasks;

    constructor() public {
        createTask("Say hello to the blockchain");
    }

    event TaskCreated(uint256 id, string content, bool done);

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content, false);
    }

    function toggleCompleted(uint256 _id) public {
        Task memory _task = tasks[_id];
        _task.done = !_task.done;
        tasks[_id] = _task;
        emit TaskCompleted(_id, _task.done);
    }
}
