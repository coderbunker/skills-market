pragma solidity ^0.4.0;

contract SkillsMarket {

    // one organisation means one hackathon, there is no people on hackathon
    // from other organisations

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
        bytes32 skill;
        uint spendHours;
        uint demandHours;
    }
    
    function SkillsMarket() {
        // define authorities
        Certification memory certificate = Certification('authority', 0, 0);
        authorities[msg.sender].push(Certification('authority', 0, 0));
    }

    function registerSkillOwnershipForAuthority(bytes32 skillName, uint demandHours) public {
        require(authorities[msg.sender].length != 0);
        
        Certification memory cert = Certification(skillName, demandHours, demandHours);
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

    function registerMemberSkills(address member, bytes32 skill, uint spendHours, uint demandHours) public {
        // check if sender is authority who owns right to distribute certificates
        require(authorities[msg.sender].length != 0);
        
        Certification memory cert = Certification(skill, spendHours, demandHours);
        skills[member].push(cert);
    }
    
    function askForHelp(uint256 hash, address org, bytes32 skill, uint time, uint cost) payable public {
        // check if amount of ether from sender is enough to cover cost
        require(msg.value >= cost);

        SkillToken memory skillToken = SkillToken(org, skill, time, cost);
        requests[hash].push(skillToken); 
    }
    
    function completeMentorship(uint256 hash, bytes32 skill, address mentee) payable public {
        // TODO check if sender belongs to organisation 
        // TODO check if hash exist in array
        require(requests[hash].length != 0);
        require(hasSkill(skill));
        require(this.balance == hasSkillTokenFromRequests(hash, skill).cost);
    
        SkillToken memory skillToken = hasSkillTokenFromRequests(hash, skill);
        // TODO increase certification on amout of spend time
        // TODO get certificate for user who asked for help  
        // TODO update his records 
        updateCertificate(skillToken, getCertificateForSkill(msg.sender, skill));
        // TODO delete record 'request for help'
        removeRequestForHelpRecord(hash, skillToken);
        // TODO withdraw funds 
        withdrawFunds(skillToken);
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
    
    function hasSkillTokenFromRequests(uint256 hash, bytes32 skill) private returns(SkillToken) {
        SkillToken result;
        SkillToken[] storage data = requests[hash];
        for (uint256 idx = 0; idx < data.length; idx++) {
            SkillToken skillToken = data[idx];
            if (skillToken.skill == skill) {
                result = skillToken;
                break;
            }
        }
        return result;
    }
    
    function getCertificateForSkill(address user, bytes32 skill) private returns(Certification) {
        Certification result;
        Certification[] certs = skills[user];
        for (uint256 idx = 0; idx < certs.length; idx++) {
            if (certs[idx].skill == skill) {
                result = certs[idx];
                break;
            }
        }
        return result;
    }
    
    function updateCertificate(SkillToken skillToken, Certification certification) public {
        Certification memory cert;
        Certification[] storage certs = skills[skillToken.requester];
        
        // find certificate
        for (uint idx = 0; idx < certs.length; idx++) {
            if (certs[idx].skill == skillToken.skill) {
                cert = certs[idx];
                break;
            } 
        }
        
        // update certificate 
        if (cert.skill == "") {
            cert = Certification(
                    skillToken.skill, 
                    certification.spendHours, 
                    certification.demandHours);
            skills[skillToken.requester].push(cert);
        } else {
            skills[skillToken.requester][idx].spendHours += skillToken.time;
        }
    }
    
    function removeRequestForHelpRecord(uint256 hashKey, SkillToken skillToken) private {
        SkillToken[] storage data = requests[hashKey];
        requests[hashKey] = shrinkSet(data, skillToken);
    }
    
    function shrinkSet(SkillToken[] data, SkillToken toRemove) private returns (SkillToken[]) {
        SkillToken[] result;
        uint newLength;
        uint oneEntryArray = 1;
        if (data.length >= oneEntryArray) {
            newLength = data.length - 1;
        } else {
            newLength = 0;
        }

        result.length = newLength;
        if (newLength != 0) {
            for (uint idx = 0; idx < data.length; idx++) {
                if (data[idx].skill == toRemove.skill) continue;
                result.push(data[idx]);
            }
        }
        return result;
    }
    
    function withdrawFunds(SkillToken skillToken) private {
        msg.sender.transfer(skillToken.cost);
    }
}