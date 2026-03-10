// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title NodeRegistry
/// @notice Registry for MACMINICLAWS swarm network nodes on Base Sepolia (chain 84532).
/// @dev Each address may register exactly one node. Nodes can be deactivated by their owner.
contract NodeRegistry {
    struct Node {
        address walletAddress;
        string nodeId;
        string hardwareSpec;
        uint256 registeredAt;
        bool isActive;
    }

    /// @notice Emitted when a new node is registered.
    event NodeRegistered(address indexed wallet, string nodeId);

    /// @notice Emitted when a node is deactivated by its owner.
    event NodeDeactivated(address indexed wallet);

    /// @dev Mapping from wallet address to its registered node.
    mapping(address => Node) private nodes;

    /// @dev Array of all registered node addresses for enumeration.
    address[] private nodeAddresses;

    /// @notice Register a new node in the swarm network.
    /// @param nodeId   Unique identifier for the node.
    /// @param hardwareSpec  Human-readable hardware specification string.
    function registerNode(string calldata nodeId, string calldata hardwareSpec) external {
        require(nodes[msg.sender].walletAddress == address(0), "NodeRegistry: address already registered");
        require(bytes(nodeId).length > 0, "NodeRegistry: nodeId must not be empty");
        require(bytes(hardwareSpec).length > 0, "NodeRegistry: hardwareSpec must not be empty");

        nodes[msg.sender] = Node({
            walletAddress: msg.sender,
            nodeId: nodeId,
            hardwareSpec: hardwareSpec,
            registeredAt: block.timestamp,
            isActive: true
        });

        nodeAddresses.push(msg.sender);

        emit NodeRegistered(msg.sender, nodeId);
    }

    /// @notice Deactivate the caller's registered node.
    function deactivateNode() external {
        require(nodes[msg.sender].walletAddress != address(0), "NodeRegistry: no node registered");
        require(nodes[msg.sender].isActive, "NodeRegistry: node already inactive");

        nodes[msg.sender].isActive = false;

        emit NodeDeactivated(msg.sender);
    }

    /// @notice Retrieve full node information for a given address.
    /// @param nodeAddress The wallet address of the node owner.
    /// @return The Node struct associated with the address.
    function getNode(address nodeAddress) external view returns (Node memory) {
        return nodes[nodeAddress];
    }

    /// @notice Return the total number of registered nodes (active and inactive).
    /// @return The length of the node addresses array.
    function getNodeCount() external view returns (uint256) {
        return nodeAddresses.length;
    }

    /// @notice Check whether an address has a registered node.
    /// @param nodeAddress The wallet address to check.
    /// @return True if the address has registered a node, false otherwise.
    function isNodeRegistered(address nodeAddress) external view returns (bool) {
        return nodes[nodeAddress].walletAddress != address(0);
    }
}
