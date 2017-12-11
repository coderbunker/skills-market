pragma solidity ^0.4.0;

contract SkillsMarket {

    // one organisation means one hackathon, there is no people on hackathon
    // from other organisations
    int8 constant NOT_FOUND = -1;
    
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

    function getSkillLevel(address person, uint hashKey) public constant returns(int) {
        int skillLevel = NOT_FOUND;
        Certification[] certs = skills[person];
        for (uint8 idx = 0; idx < certs.length; idx++) {
            if (certs[idx].hashKey == hashKey) {
                skillLevel = int(certs[idx].spendHours);
                break;
            }
        }
        return skillLevel;
    }

    function getSkillName(address person, uint hashKey) public constant returns(bytes32 skillName) {
        Certification[] certs = skills[person];
        for (uint8 idx = 0; idx < certs.length; idx++) {
            if (certs[idx].hashKey == hashKey) {
                skillName = certs[idx].skill;
                break;
            }
        }
        return skillName;
    }
    
    function findCertForMentor(address mentor, address mentee, uint256 hashKey, uint8 time, uint8 cost) public constant returns(int8 mentorCertIdx) {
        require(this.balance >= cost);
        
        // region find certificate for mentor 
        mentorCertIdx = NOT_FOUND;
        Certification[] storage mentorCerts = skills[mentor];
        for (uint8 idx = 0; idx < mentorCerts.length; idx++) {
            if (mentorCerts[idx].hashKey == hashKey) {
                // find cert, use this idx to access it
                mentorCertIdx = int8(idx);
                break;
            }
        }
        
        require(mentorCertIdx != NOT_FOUND);
        return mentorCertIdx;   
    }

    function findCertForSkillMentee(address mentor, address mentee, uint256 hashKey, uint8 time, uint8 cost) public constant returns(int8 menteeCertIdx) {
        menteeCertIdx = NOT_FOUND;
        Certification[] storage certs = skills[mentee];
        for (uint idx = 0; idx < certs.length; idx++) {
            if (certs[idx].hashKey == hashKey) {
                // find cert, use this idx to access it
                menteeCertIdx = int8(idx);
                break;
            }
        }
        return menteeCertIdx;
    }

    function findCertLengthForMentee(address mentee) public constant returns (uint result) {
        return skills[mentee].length;
    }

   // change state of blockchain
    function updateCerts(address mentor, address mentee, uint256 hashKey, uint8 time, uint8 cost) public payable {
        // require(this.balance >= cost); TODO something doesn't work here 
        // region find certificate for mentor 
        int8 mentorCertIdx = NOT_FOUND;
        Certification[] storage mentorCerts = skills[mentor];
        for (uint8 idx = 0; idx < mentorCerts.length; idx++) {
            if (mentorCerts[idx].hashKey == hashKey) {
                // find cert, use this idx to access it
                mentorCertIdx = int8(idx);
                break;
            }
        }
        
        require(mentorCertIdx != NOT_FOUND);

        int8 menteeCertIdx = NOT_FOUND;
        Certification[] storage certs = skills[mentee];
        for (idx = 0; idx < certs.length; idx++) {
            if (certs[idx].hashKey == hashKey) {
                // find cert, use this idx to access it
                menteeCertIdx = int8(idx);
                break;
            }
        }
        
        if (skills[mentee].length == 0) {
            Certification memory cert = Certification(
                hashKey, 
                mentorCerts[uint8(mentorCertIdx)].skill, 
                time, 
                mentorCerts[uint8(mentorCertIdx)].demandHours
            );
            skills[mentee].push(cert);
        } else {
            // update certificate 
            certs[idx].spendHours += time; 
            skills[mentee] = certs;
        } 

        // provide money transfer
        msg.sender.transfer(cost);
    }

    function certify(address mentor, address mentee, uint256 hashKey, uint8 time, uint8 cost) public payable {
		require(this.balance >= cost);
        
        // region find certificate for mentor 
        int8 mentorCertIdx = NOT_FOUND;
        Certification[] storage mentorCerts = skills[mentor];
        for (uint8 idx = 0; idx < mentorCerts.length; idx++) {
            if (mentorCerts[idx].hashKey == hashKey) {
                // find cert, use this idx to access it
                mentorCertIdx = int8(idx);
                break;
            }
        }
        
        require(mentorCertIdx != NOT_FOUND);
        
        // endregion
        
        // region find certificate for skill-mentee 
        int8 menteeCertIdx = NOT_FOUND;
        Certification[] storage certs = skills[mentee];
        for (idx = 0; idx < certs.length; idx++) {
            if (certs[idx].hashKey == hashKey) {
                // find cert, use this idx to access it
                menteeCertIdx = int8(idx);
                break;
            }
        }

        // endregion

        // region if there is no certificates 
        if (skills[mentee].length == 0) {
            Certification memory cert = Certification(
                hashKey, 
                mentorCerts[uint8(mentorCertIdx)].skill, 
                time, 
                mentorCerts[uint8(mentorCertIdx)].demandHours
            );
            skills[mentee].push(cert);
        } else {
            // update certificate 
            certs[idx].spendHours += time; 
            skills[mentee] = certs;
        } 

        // endregion
        
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
	
	function getCertificateHours(address owner, uint hashKey) public returns(int8) {
		int8 result = NOT_FOUND;
		Certification[] certs = skills[owner];
		for (uint8 id = 0; id < certs.length; id++) {
			if (certs[id].hashKey == hashKey) {
				result = int8(hashKey); 
			}
		}
		return result;
	} 
	
	function getSkillForMember(address member) public constant returns(uint) {
		return skills[member].length; 
	}

	function getAmountOfPeopleWaitingForHelp(uint256 hash) public constant returns(uint) {
		return requests[hash].length; 
	}
	
    function registerMemberSkills(address member, uint hashKey, bytes32 skill, uint spendHours, uint demandHours) public {        
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
