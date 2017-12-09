pragma solidity ^0.4.0;

contract SkillsMarket {

    // one organisation means one hackathon, there is no people on hackathon
    // from other organisations
    int8 constant NOT_FOUND = -1;
    
	// authorities
 	mapping(address => Certification[]) authorities;
	// organisation
	mapping(address => bytes32) organisations;
	// members for organisation 
	mapping(address => address[]) members;
	// qualification 
	mapping(address => Certification[]) skills;
    // requests
    mapping(uint256 => SkillToken[]) requests; // key = hash(org_name + skill)

    // TODO create event which would be triggered when someone ask for help 
    // TODO analyse what kind of data would be avaialble for person on server 
    // TODO trigger transaction with such data 
    
    event SkillRequest(
        uint256 hash, 
        address org, 
        address mentee,
        bytes32 skill, 
        uint time, 
        uint cost);

    // TODO send signal about new request 
    // TODO mentor finished and certified the mentee 
    
    function certify(address mentor, address mentee, uint256 hashKey, uint8 time, uint8 cost) public payable {
		require(this.balance >= cost);
        
        // find certificate for mentor 
        int8 mentorCertIdx = NOT_FOUND;
        Certification[] storage certs = skills[mentor];
        for (uint8 idx = 0; idx < certs.length; idx++) {
            if (certs[idx].hashKey == hashKey) {
                // find cert, use this idx to access it
                mentorCertIdx = int8(idx);
                break;
            }
        }
        
        require(mentorCertIdx != NOT_FOUND);
        // find certificate for skill-mentee 
        int8 menteeCertIdx = NOT_FOUND;
        certs = skills[mentee];
        for (idx = 0; idx < certs.length; idx++) {
            if (certs[idx].hashKey == hashKey) {
                // find cert, use this idx to access it
                menteeCertIdx = int8(idx);
                break;
            }
        }
        // update certificate 
        certs[idx].spendHours += time; 
        skills[mentee] = certs; 
        
        // provide money transfer
        msg.sender.transfer(cost);
    }

    struct Mentor {
        address person; 
        bytes32[] data; // skills
    }

    struct SkillToken {
        address requester;
        bytes32 skill; 
        uint time;
        uint cost;
    }
    
    struct Certification {
        uint256 hashKey; // it should be unique id hash(org_name + skill)
        bytes32 skill; 
        uint spendHours;
        uint demandHours;
    }
    
    function SkillsMarket3() public {
        // define authorities
        authorities[msg.sender].push(Certification(1, 'authority', 0, 0));
    }
	
	function getCertificateHours(address owner, uint hashKey) public returns(uint) {
		uint result = NOT_FOUND;
		Certification[] certs = skills[owner];
		for (uint8 id = 0; id < certs.length; id++) {
			if (certs[id].hashKey == hashKey) {
				result = hashKey; 
			}
		}
		return result;
	} 
	
	function getAuthorities() public constant returns(uint) {
		return authorities[msg.sender].length;
	}
	
	function getSkillForAuthority() public constant returns(uint) {
		return authorities[msg.sender].length;
	}
	
	function getOrganisation(address org) public constant returns(bytes32) {
		return organisations[org];
	} 
	
	function getMembersForOrganisation() public constant returns(uint) {
		return members[msg.sender].length;
	}
	
	function getSkillForMember(address member) public constant returns(uint) {
		return skills[member].length; 
	}

	function getAmountOfPeopleWaitingForHelp(uint256 hash) public constant returns(uint) {
		return requests[hash].length; 
	}
	
    function registerSkillOwnershipForAuthority(bytes32 skillName, uint demandHours) public {
        require(authorities[msg.sender].length != 0);
        
        Certification memory cert = Certification(1, skillName, demandHours, demandHours);
        authorities[msg.sender].push(cert);
    }

    function registerOrganisation(address org, bytes32 orgName) public {
        require(authorities[msg.sender].length != 0);
        organisations[org] = orgName;
    }

    function registerMemberForOrganisation(address org, address member) public {
        require(authorities[msg.sender].length != 0 || msg.sender == org);
        members[msg.sender].push(member);
    }

    function registerMemberSkills(address member, uint hashKey, bytes32 skill, 
                                  uint spendHours, uint demandHours) public {
        // check if sender is authority who owns right to distribute certificates
        require(authorities[msg.sender].length != 0);
        
        Certification memory cert = Certification(hashKey, skill, spendHours, demandHours);
        skills[member].push(cert);
    }
	
    function askForHelp(uint256 hash, address org, bytes32 skill, uint time, uint cost) payable public {
        // check if amount of ether from sender is enough to cover cost
        require(msg.value >= cost);

        SkillToken memory skillToken = SkillToken(org, skill, time, cost);
        requests[hash].push(skillToken); 
    }
    
    function hasSkill(bytes32 skill) private returns(bool) {
        bool senderHasSkill = false;
        Certification[] certs = skills[msg.sender];
        for (uint id = 0; id < certs.length; id++) {
            if (certs[id].skill == skill) {
                senderHasSkill = true;
                break;
            }
        }
        return senderHasSkill;
    }
    
    function toBytes(uint256 x) returns (bytes result) {
        result = new bytes(32);
        assembly { mstore(add(result, 32), x) }
        return result;
    }
    
}
