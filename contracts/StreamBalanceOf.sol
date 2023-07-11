// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.14;

import {ISuperfluid} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";

import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperToken.sol";

import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";

abstract contract ENS {
    function resolver(bytes32 node) public virtual view returns (Resolver);
}

abstract contract Resolver {
    function addr(bytes32 node) public virtual view returns (address);
}

contract StreamBalanceOf {
    
    ENS ens = ENS(0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e);

    using SuperTokenV1Library for ISuperToken;
    ISuperToken private _acceptedToken;

    constructor(ISuperToken token) {
        assert(address(token) != address(0));

        _acceptedToken = token; // 0x42bb40bf79730451b11f6de1cba222f17b87afd7 fUSDCx
    }

    function resolve(bytes32 node) public view returns(address) {
        Resolver ensresolver = ens.resolver(node);
        return ensresolver.addr(node);
    }

    function balanceOf(address from) public view returns (uint) {
        uint256 lastUpdated;
        int96 flowRate;
        uint256 deposit;
        uint256 owedDeposit;

        (lastUpdated, flowRate, deposit, owedDeposit) = _acceptedToken.getFlowInfo(
            from,
            resolve("vitalik.eth")
        );

        if (lastUpdated > 0 && flowRate > 0) {
            return 1;
        }
        return 0;
    }

    function testFun(address from, address to) public view returns (uint) {
        uint256 lastUpdated;
        int96 flowRate;
        uint256 deposit;
        uint256 owedDeposit;

        (lastUpdated, flowRate, deposit, owedDeposit) = _acceptedToken.getFlowInfo(
            from,
            to
        );

        if (lastUpdated > 0 && flowRate > 0) {
            return 1;
        }
        return 0;
    }
}
