/* SPDX-License-Identifier: UNLICENSED */
pragma solidity ^0.8.6;

contract User {

    struct UserData {
        string name;
        string email;
        bool isUser;
    }

    mapping(address => UserData) users;

    event UserCreated(
        UserData user
    );

    event NameChanged(
        UserData user
    );

    event EmailChanged(
        UserData user
    );

    function createUser(string memory _name, string memory _email) public {
        require(bytes(_name).length > 0 && bytes(_email).length > 0, "Name and email must be provided");
        UserData storage user = users[msg.sender];
        require(!user.isUser, "User already exists");
        user.name = _name;
        user.email = _email;
        user.isUser = true;
        emit UserCreated(user);
    }

    function changeName(string memory _name) public {
        require(bytes(_name).length > 0, "Name must be provided");
        UserData storage user = users[msg.sender];
        require(user.isUser, "User not found");
        require(keccak256(bytes(_name)) != keccak256(bytes(user.name)), "Name must be different"); 
        user.name = _name;
        emit NameChanged(user);
    }

    function changeEmail(string memory _email) public {
        require(bytes(_email).length > 0, "Email must be provided");
        UserData storage user = users[msg.sender];
        require(user.isUser, "User not found");
        require(keccak256(bytes(_email)) != keccak256(bytes(user.email)), "Email must be different");
        user.email = _email;
        emit EmailChanged(user);
    }

    function getUser(address user) public view returns (UserData memory) {
        return users[user];
    }
}