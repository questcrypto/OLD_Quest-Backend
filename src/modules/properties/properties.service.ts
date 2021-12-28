import {
  BadRequestException,
  Body,
  HttpException,
  HttpStatus,
  Injectable,
  ParseBoolPipe,
  Post,
} from '@nestjs/common';
import { v4 } from 'uuid';
import { getAuctionBy } from '../auction/auction.repository';
var TX = require('ethereumjs-tx');
const e = require('express');
const { async } = require('rxjs');
const Web3 = require('web3');
import {configService} from '../../Services/config.service'
let env = configService.getenvConfig();
//var providerURL =
 // 'https://rinkeby.infura.io/v3/422ff8b52c6a43eb8a2d269ce3495c9f';
const providerURL= env.providerURL
const web3 = new Web3(new Web3.providers.HttpProvider(providerURL));
import {
  ApproveByOwner,
  Floordetail,
  IFetchUnreadComment,
  MessageResponse,
  onboardingCountIF,
  propertyComment,
  TypeofDocument,
} from '../properties/properties.interface';
import {
  FetchCommentDto,
  FetchUnreadCommentDto,
  FloorDetailDTO,
  PropertyComment,
  propertyDto,
  PropertyImageDto,
  propertyImageUpdateDto,
  propertyUpdateDto,
} from './properties.dto';
import { FloorDetail, propertyFiles } from './properties.entity';
import { TypeOfProperty } from './properties.interface';
import {
  propertyRepository,
  FloorRepository,
  propertyFilesRepository,
  GetAllPublishedProperties,
  getPropertyByPublicAddress,
  getPropertyBy,
  getFloorDetails,
  getFileDetails,
  getAllProperty,
  getAllProperties,
  propertyCommentRepository,
  getCommentByID,
  fetchUnreadComment,
  updateIsread,
  GetApprovedPropertyForHOAAdmin,
  GetApprovedPropertyByPropertyOnwer,
  GetpublishedPropertiesForAdmins,
  GetPublishedPropertiesForOwners,
  updatenullvalues,
  updateIsActive,
  getPropertyOnboardCount,
  getPropertyFilesBy,
} from './properties.repository';
import { EmailsService } from '../emails/emails.service';
import {
  NotificationType,
  Notification,
} from '../emails/notification.interface';
import { getUserBy } from '../user/user.repository';

@Injectable()
export class PropertiesService {
  slf_interface;
  slc_interface;
  mintNFT_interface;
  SLFContractAddress;
  SLCContractAddress;
  mintNFTContractAddress;

  constructor(
    public readonly propertyRepository: propertyRepository,
    public readonly floorRepository: FloorRepository,
    public readonly propertyFilesRepository: propertyFilesRepository,
    public readonly propertyCommentRepository: propertyCommentRepository,
    public readonly notificationService: EmailsService,
  ) {
    this.SLFContractAddress = '0xfC105f097Be85EC698D11e9ab2B9744F2A991749';
    this.SLCContractAddress = '0x4f54acbE20F61Ab83B7235b1EdC1E0DfcFB98967';
    this.mintNFTContractAddress = '0x085fc0C1F7EB4586ed9444acEf75f7C136a7330F';

    //SLF Contract interface
    const slf_abi = [
      { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        name: 'AdminDeleted',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        name: 'NewAdminAdded',
        type: 'event',
      },
      {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: 'AdminMApping',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: '_origValue', type: 'uint256' },
          { internalType: 'uint256', name: '_currValue', type: 'uint256' },
          { internalType: 'uint256', name: '_coins_issued', type: 'uint256' },
          {
            internalType: 'uint256',
            name: '_equity_at_issuance',
            type: 'uint256',
          },
          { internalType: 'uint256', name: '_varriation', type: 'uint256' },
          {
            internalType: 'uint256',
            name: '_current_coin_value',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: '_orig_issue_rate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: '_next_schedule_reevaluation',
            type: 'uint256',
          },
          { internalType: 'string', name: 'token_uri', type: 'string' },
          { internalType: 'string', name: 'propertyID', type: 'string' },
        ],
        name: 'ListProperty_details',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'newAdmin', type: 'address' },
        ],
        name: 'addAdmin',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'ExistingAdmin', type: 'address' },
        ],
        name: 'delAdmin',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'property_id', type: 'uint256' },
        ],
        name: 'listFromTempInfo',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'propInfo',
        outputs: [
          { internalType: 'uint256', name: 'origValue', type: 'uint256' },
          { internalType: 'uint256', name: 'currValue', type: 'uint256' },
          { internalType: 'uint256', name: 'coins_issued', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'equity_at_issuance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'Total_Current_Value',
            type: 'uint256',
          },
          { internalType: 'uint256', name: 'Varriation', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'Current_Coin_Value',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'Original_Issuance_Rate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'Next_Schedule_Revaluation',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: '_address', type: 'address' },
        ],
        name: 'setSLC_contract_address',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: 'temppropInfo',
        outputs: [
          { internalType: 'uint256', name: 'origValue', type: 'uint256' },
          { internalType: 'uint256', name: 'currValue', type: 'uint256' },
          { internalType: 'uint256', name: 'coins_issued', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'equity_at_issuance',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'Total_Current_Value',
            type: 'uint256',
          },
          { internalType: 'uint256', name: 'Varriation', type: 'uint256' },
          {
            internalType: 'uint256',
            name: 'Current_Coin_Value',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'Original_Issuance_Rate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'Next_Schedule_Revaluation',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ];
    this.slf_interface = new web3.eth.Contract(
      slf_abi,
      this.SLFContractAddress,
    );

    //SLC Contract interface
    const slc_abi = [
      {
        inputs: [
          { internalType: 'uint256', name: '_initialSupply', type: 'uint256' },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: '_owner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: '_spender',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: '_value',
            type: 'uint256',
          },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'address',
            name: '',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        name: 'DepositFunds',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        name: 'RegionAdminAdded',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        name: 'RegionAdminChanged',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'address',
            name: '',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
          { indexed: false, internalType: 'string', name: '', type: 'string' },
        ],
        name: 'TransactionCompleted',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'address',
            name: '',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
          { indexed: false, internalType: 'string', name: '', type: 'string' },
        ],
        name: 'TransactionCreated',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'address',
            name: '',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        name: 'TransactionSigned',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: '_from',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: '_to',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'uint256',
            name: '_value',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        name: 'ownerAdded',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        name: 'ownerRemoved',
        type: 'event',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'tokenid', type: 'uint256' },
          { internalType: 'address', name: 'receiver', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'string', name: 'token_uri', type: 'string' },
          { internalType: 'string', name: 'propertyID', type: 'string' },
        ],
        name: 'InitiateTransaction',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'SLf_contract_address',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: '', type: 'address' }],
        name: '_owners',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: '_transactionIdx',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        name: '_transactions',
        outputs: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
          { internalType: 'uint256', name: 'tokenid', type: 'uint256' },
          { internalType: 'uint8', name: 'signatureCount', type: 'uint8' },
          { internalType: 'string', name: 'tokenURI', type: 'string' },
          { internalType: 'string', name: 'propertyID', type: 'string' },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: '_owner', type: 'address' }],
        name: 'addOwner',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'region_no', type: 'uint256' },
          { internalType: 'address', name: '_address', type: 'address' },
        ],
        name: 'add_region_admin',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: '', type: 'address' },
          { internalType: 'address', name: '', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: '_spender', type: 'address' },
          { internalType: 'uint256', name: '_value', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: 'request', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: '_region_no', type: 'uint256' },
          { internalType: 'address', name: '_address', type: 'address' },
        ],
        name: 'change_region_admin',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'decimals',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'transactionId', type: 'uint256' },
        ],
        name: 'deleteTransaction',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'getPendingTransactions',
        outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'mintNFT_contract_address',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: '_oldAddress', type: 'address' },
          { internalType: 'address', name: '_newAddress', type: 'address' },
        ],
        name: 'modify',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'owner',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: '_owner', type: 'address' }],
        name: 'removeOwner',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: '_from', type: 'address' },
          { internalType: 'address', name: '_to', type: 'address' },
          { internalType: 'uint256', name: '_value', type: 'uint256' },
        ],
        name: 'safetransferFrom',
        outputs: [{ internalType: 'bool', name: 'success', type: 'bool' }],
        stateMutability: 'payable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: '_address', type: 'address' },
        ],
        name: 'setSLF_contract_address',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: '_address', type: 'address' },
        ],
        name: 'setmintNFT_contract_address',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'uint256', name: 'transactionId', type: 'uint256' },
        ],
        name: 'signTransaction',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'walletBalance',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      { stateMutability: 'payable', type: 'receive' },
    ];
    this.slc_interface = new web3.eth.Contract(
      slc_abi,
      this.SLCContractAddress,
    );

    //mintNFT Contract interface
    const mintNFT_abi = [
      {
        inputs: [
          { internalType: 'address', name: '_address', type: 'address' },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'approved',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'operator',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'bool',
            name: 'approved',
            type: 'bool',
          },
        ],
        name: 'ApprovalForAll',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        inputs: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'baseURI',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'string', name: 'new_base_uri', type: 'string' },
        ],
        name: 'changeBaseURI',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'address', name: '_new', type: 'address' }],
        name: 'changeSLCAddress',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
        name: 'getApproved',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'owner', type: 'address' },
          { internalType: 'address', name: 'operator', type: 'address' },
        ],
        name: 'isApprovedForAll',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'to_', type: 'address' },
          { internalType: 'uint256', name: 'id_', type: 'uint256' },
          { internalType: 'string', name: 'token_uri', type: 'string' },
        ],
        name: 'mint',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
        name: 'ownerOf',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
          { internalType: 'bytes', name: '_data', type: 'bytes' },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'operator', type: 'address' },
          { internalType: 'bool', name: 'approved', type: 'bool' },
        ],
        name: 'setApprovalForAll',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'bytes4', name: 'interfaceId', type: 'bytes4' },
        ],
        name: 'supportsInterface',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint256', name: 'index', type: 'uint256' }],
        name: 'tokenByIndex',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'owner', type: 'address' },
          { internalType: 'uint256', name: 'index', type: 'uint256' },
        ],
        name: 'tokenOfOwnerByIndex',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
        name: 'tokenURI',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ];
    this.mintNFT_interface = new web3.eth.Contract(
      mintNFT_abi,
      this.mintNFTContractAddress,
    );

    /*
     * Default Deployer Account Address and private key
     */

    const account1 = '0xF51632261987F4578425Ca91a48117E11516a4CF'; //admin in SLF and owners in SLC
    const account2 = '0xA499569422a00d7f612ab91a47B3cb8C6Be71884'; //admin in SLF and owners in SLC

    const privateKey1 =
      'bbe63d1fba1794a8c74bfd779c1ae2535a1d5953a6ee6aec609c2351db57fff8';
    const privateKey2 =
      '9525d3eef65fd22cff71b627c35003d27472370f4067246dbbcedec692b66309';
  }

  async Addproperty(files, body: propertyDto): Promise<MessageResponse> {
    try {
      const prop = v4();
      const PropertyDetail = {
        id: prop,
        NftCid: body.NftCid,
        Fname: body.Fname,
        Lname: body.Lname,
        Email: body.Email,
        PublicAddress: body.PublicAddress.toLowerCase(),
        PropertyType:
          TypeOfProperty.SingleFamilyResidence == body.PropertyType
            ? 1
            : TypeOfProperty.MultiFamilyResidence == body.PropertyType
            ? 2
            : TypeOfProperty.Commercial == body.PropertyType
            ? 3
            : TypeOfProperty.DevelopingLand == body.PropertyType
            ? 4
            : TypeOfProperty.RawLand == body.PropertyType
            ? 5
            : 0,
        PropertyName: body.PropertyName,
        CurrentValue: body.CurrentValue,
        Comments: body.Comments,
        YearBuilt: body.YearBuilt,
        Zoning: body.Zoning,
        Landscaping: body.Landscaping,
        Lotfacts: body.Lotfacts,
        Address1: body.Address1,
        Address2: body.Address2,
        City: body.City,
        State: body.State,
        Subdivision: body.Subdivision,
        Country: body.Country,
        PostalCode: body.PostalCode,
        SchoolDistrict: body.SchoolDistrict,
        Elementary: body.Elementary,
        JrHigh: body.JrHigh,
        HighSchool: body.HighSchool,
        Insurance: body.Insurance,
        Maintenance: body.Maintenance,
        Taxes: body.Taxes,
        Expenses: body.Expenses,
        AC: body.AC,
        Heating: body.Heating,
        Roof: body.Roof,
        Deck: body.Deck,
        Floor: body.Floor,
        WindowCovering: body.WindowCovering,
        Pool: body.Pool,
        PoolFeature: body.PoolFeature,
        Style: body.Style,
        Patio: body.Patio,
        Garage: body.Garage,
        Carpot: body.Carpot,
        ParkingSpace: body.ParkingSpace,
        FinBasmt: body.FinBasmt,
        Basement: body.Basement,
        Driveway: body.Driveway,
        Water: body.Water,
        WaterShare: body.WaterShare,
        Spa: body.Spa,
        ApprovedByOwner: false,
        ApprovedByHOA: false,
        Isactive: false,
      };
      await this.propertyRepository.insert(PropertyDetail);

      var floordetailsArray = JSON.stringify(body.FloorDetails);
      var floorArr: FloorDetail = JSON.parse(JSON.parse(floordetailsArray));

      for (
        var i = 0;
        i < JSON.parse(JSON.parse(floordetailsArray)).length;
        i++
      ) {
        (floorArr[i].propid = prop), (floorArr[i].id = v4());
      }
      await this.floorRepository.insert(floorArr);
      var propertyimages = JSON.stringify(body.PropertyImages);
      var Imagearr: propertyFiles = JSON.parse(JSON.parse(propertyimages));
      for (var i = 0; i < JSON.parse(JSON.parse(propertyimages)).length; i++) {
        (Imagearr[i].propid = prop),
          (Imagearr[i].id = v4()),
          (Imagearr[i].filename =
            files[
              files.findIndex(x => x.originalname === Imagearr[i].OriginalName)
            ].filename),
          (Imagearr[i].type = TypeofDocument.Images);
      }
      await this.propertyFilesRepository.insert(Imagearr);
      var propertydocs = JSON.stringify(body.PropertyDocs);
      var Docarr: propertyFiles = JSON.parse(JSON.parse(propertydocs));
      for (var i = 0; i < JSON.parse(JSON.parse(propertydocs)).length; i++) {
        (Docarr[i].propid = prop),
          (Docarr[i].id = v4()),
          (Docarr[i].filename =
            files[
              files.findIndex(x => x.originalname === Docarr[i].OriginalName)
            ].filename),
          (Docarr[i].type = TypeofDocument.Documents);
      }
      await this.propertyFilesRepository.insert(Docarr);
      // const user = await getUserBy({publicaddress:body.PublicAddress})
      // await this.notificationService.notifications(

      //         user.id,
      //         'A new is property added',
      //         NotificationType.addNewProperty,
      // )

      return MessageResponse.Successfull;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async GetAllPropertyByPublicAddress(publicAddress: string): Promise<any> {
    try {
      var properties = await getPropertyByPublicAddress(publicAddress);
      for (var i = 0; i < properties.length; i++) {
        var doc = await getFileDetails(properties[i].id);
        properties[i]['getDoc'] = doc;
      }
      return properties;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async GetAllProperty(): Promise<any> {
    try {
      var properties = await getAllProperty();
      for (var i = 0; i < properties.length; i++) {
        var doc = await getFileDetails(properties[i].id);
        properties[i]['getDoc'] = doc;
      }
      return properties;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async GetPropertyByID(id: string): Promise<any> {
    //     console.log(id);
    var floordetail = await getFloorDetails(id);
    var getDocs = await getFileDetails(id);
    var propertyDetails = await getPropertyBy({ id });
    var res = {
      floordetail: floordetail,
      getDocs: getDocs,
      propertyDetails: propertyDetails,
    };
    return res;
  }

  async updateIsactive(id: string): Promise<any> {
    try {
      return await updateIsActive(id);
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  async AddComment(data: PropertyComment): Promise<any> {
    try {
      const id = v4();
      const input = {
        id: id,
        propid: data.propid,
        Field: data.Field,
        Remark: data.Remark,
        CommentedBy: data.CommentedBy,
        Isread: false,
      };
      await this.propertyCommentRepository.insert(input);
      //const user = await getUserBy({publicaddress:data.CommentedBy})
      // await this.notificationService.notifications(

      //         user.id,
      //         'commented on property',
      //         NotificationType.AddComment,
      // )

      return { message: 'commented is added!!' };
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  async UpdateProperties(body: propertyUpdateDto): Promise<any> {
    try {
      const id = body.id;
      var propertyDetail = await getPropertyBy({ id });
      console.log(propertyDetail);
      if (propertyDetail) {
        var data:any = {
          Fname: body.Fname,
          Lname: body.Lname,
          Email: body.Email,
          PublicAddress: body.PublicAddress.toLowerCase(),
          PropertyType: body.PropertyType,
          PropertyName: body.PropertyName,
          CurrentValue: body.CurrentValue,
          Comments: body.Comments,
          YearBuilt: body.YearBuilt,
          Zoning: body.Zoning,
          Landscaping: body.Landscaping,
          Lotfacts: body.Lotfacts,
          Address1: body.Address1,
          Address2: body.Address2,
          City: body.City,
          State: body.State,
          Subdivision: body.Subdivision,
          Country: body.Country,
          PostalCode: body.PostalCode,
          SchoolDistrict: body.SchoolDistrict,
          Elementary: body.Elementary,
          JrHigh: body.JrHigh,
          HighSchool: body.HighSchool,
          Insurance: body.Insurance,
          Maintenance: body.Maintenance,
          Taxes: body.Taxes,
          Expenses: body.Expenses,
          AC: body.AC,
          Heating: body.Heating,
          Roof: body.Roof,
          Deck: body.Deck,
          Floor: body.Floor,
          WindowCovering: body.WindowCovering,
          Pool: body.Pool,
          PoolFeature: body.PoolFeature,
          Style: body.Style,
          Patio: body.Patio,
          Garage: body.Garage,
          Carpot: body.Carpot,
          ParkingSpace: body.ParkingSpace,
          FinBasmt: body.FinBasmt,
          Basement: body.Basement,
          Driveway: body.Driveway,
          Water: body.Water,
          WaterShare: body.WaterShare,
          Spa: body.Spa,
        };
        if(body.NftCid){
          data.NftCid = body.NftCid;
        }

        var floorArr: FloorDetail = JSON.parse(
          JSON.parse(JSON.stringify(body.FloorDetails)),
        );
        // console.log(data);
        await this.propertyRepository.update(body.id, data);
        await this.floorRepository.update(body.id, floorArr);
        //const user = await getUserBy({publicaddress:propertyDetail.PublicAddress})
        // await this.notificationService.notifications(

        //         user.id,
        //         'property updated',
        //         NotificationType.updateProperty,
        // )

        // return { message: 'Approved by ownwer!!' }
        return MessageResponse.Successfull;
      } else {
        return MessageResponse.Error;
      }
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  async UpdatePropertyImage(files, body: propertyImageUpdateDto): Promise<any> {
    try {
      const id = body.id;
      var propertyImageDetail = await getPropertyFilesBy({ id });
      console.log(propertyImageDetail);
      if (propertyImageDetail) {
        var propertyimages = JSON.stringify(body.ImageDetail);
        var Imagearr: propertyFiles = JSON.parse(JSON.parse(propertyimages));
        console.log(Imagearr);
        for (
          var i = 0;
          i < JSON.parse(JSON.parse(propertyimages)).length;
          i++
        ) {
          (Imagearr[i].filename =
            files[files.findIndex(x => x.originalname)].filename),
            (Imagearr[i].type = TypeofDocument.Images);
          console.log(Imagearr);
        }
        let res = await this.propertyFilesRepository.update(id, Imagearr[0]);
        console.log(res);

        return MessageResponse.Successfull;
      } else {
        return MessageResponse.Error;
      }
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  async fetchCommentByID(body: FetchCommentDto) {
    try {
      const result = await getCommentByID(body.id, body.Field);
      await updateIsread(body.id, body.Field, body.publicAddress);
      return result;
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  //  Fetch details of unread comment

  async fetchUnreadComment(body: IFetchUnreadComment): Promise<any> {
    try {
      var details = [];
      console.log('I am in');
      details = await fetchUnreadComment(body.id, body.publicAddress);
      if (details.length > 0) {
        const keys = details.map(x => x.Field);
        const distinct = (value, index, self) => {
          return self.indexOf(value) === index;
        };
        const uniquekeys = keys.filter(distinct);
        var data = {};
        for (var i = 0; i < uniquekeys.length; i++) {
          data[`${uniquekeys[0]}`] = keys.reduce(function(n, val) {
            return n + (val === uniquekeys[0]);
          }, 0);
        }
        return data;
      } else {
        throw new HttpException('No data found', HttpStatus.NO_CONTENT);
      }
    } catch (err) {
      throw err;
    }
  }

  // Approve by Owner

  async ApproveByOwner(body: ApproveByOwner) {
    try {
      const id = body.id;
      this.propertyRepository.update(body.id, { ApprovedByOwner: true });
      var propertyDetails = await getPropertyBy({ id });
      //const user = await getUserBy({publicaddress:propertyDetails.PublicAddress})
      // await this.notificationService.notifications(

      //         user.id,
      //         'Approved property By Owner',
      //         NotificationType.ApprovedByOwner,
      // )

      return { message: 'Approved by ownwer!!' };
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  async ApproveByHOAAdmin(body: ApproveByOwner) {
    try {
      const id = body.id;
      this.propertyRepository.update(body.id, { ApprovedByHOA: true });
      var propertyDetails = await getPropertyBy({ id });
      //const user = await getUserBy({publicaddress:propertyDetails.PublicAddress})
      // await this.notificationService.notifications(

      //         user.id,
      //         'Approved property By HoaAdmin',
      //         NotificationType.ApproveByHOAAdmin,
      // )

      return { message: 'Approved by HOA Admin!!' };
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  async GetApprovedPropertiesByOwner(publicAddress: string) {
    try {
      var properties = await GetApprovedPropertyByPropertyOnwer(publicAddress);
      for (var i = 0; i < properties.length; i++) {
        let doc = await getFileDetails(properties[i].id);
        properties[i]['getDoc'] = doc;
      }

      return properties;
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  async GetPublishedPropertiesForAdmin() {
    try {
      return await GetpublishedPropertiesForAdmins();
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  async Updatevalue() {
    try {
      return this.propertyRepository.update(
        { ApprovedByHOA: null },
        { ApprovedByHOA: false },
      );
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  async GetApprovedPropertiesForHOAAdmin() {
    try {
      return await GetApprovedPropertyForHOAAdmin();
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  async GetAllProperties() {
    try {
      var properties = await getAllProperties();
      for (var i = 0; i < properties.length; i++) {
        var doc = await getFileDetails(properties[i].id);
        properties[i]['getDoc'] = doc;
      }
      return properties;
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  async GetPublishedPropertiesForOwner(publicAddress: string) {
    try {
      var properties = await GetPublishedPropertiesForOwners(publicAddress);
      console.log(properties);
      properties = properties.filter(e => {
        return e.auctionstatus == null || e.auctionstatus == false;
      });

      console.log(properties);
      console.log('daass');
      for (var i = 0; i < properties.length; i++) {
        let doc = await getFileDetails(properties[i].id);
        let propid = properties[i].id;
        let auctionDetails = await getAuctionBy({ propid });
        properties[i]['getDoc'] = doc;
        properties[i]['auctionDetails'] = auctionDetails;
      }

      return properties;
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  async GetAllPublishedProperties() {
    try {
      var properties = await GetAllPublishedProperties();
      console.log(properties);
      properties = properties.filter(e => {
        return e.auctionstatus == null || e.auctionstatus == false;
      });

      for (var i = 0; i < properties.length; i++) {
        let doc = await getFileDetails(properties[i].id);
        let propid = properties[i].id;
        let auctionDetails = await getAuctionBy({ propid });
        properties[i]['getDoc'] = doc;
        properties[i]['auctionDetails'] = auctionDetails;
      }

      return properties;
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }

  // Functions of smart contract

  async runCode(data, account, privateKey, deployedAddress) {
    var count = await web3.eth.getTransactionCount(account);
    var Price = await web3.eth.getGasPrice();
    var txData = {
      nonce: web3.utils.toHex(count),
      gasLimit: web3.utils.toHex(7500000),
      gasPrice: web3.utils.toHex(Price * 1.4),
      to: deployedAddress,
      from: account,
      data: data,
    };

    var run_code = new TX(txData, { chain: 'rinkeby' });
    run_code.sign(privateKey); //change here
    const serialisedrun_code = run_code.serialize().toString('hex');
    const result = await web3.eth.sendSignedTransaction(
      '0x' + serialisedrun_code,
    );
    //     console.log(result);
  }

  async convPrivateKeyToBuffer(key) {
    const pkey = Buffer.from(key, 'hex');
    return pkey;
  }

  /*
   * SLF Contract Functions
   */

  /*check whether given address is admin or not*/
  async checkAdminOrNot(_of) {
    try {
      var data = await this.slf_interface.methods.AdminMApping(_of).call();
      //     console.log(data);
      if (data == true) console.log(`Given Address ${_of} is admin`);
      else console.log(`Given Address ${_of} is not an admin`);
      return data;
    } catch (err) {
      throw { message: `ERROR: check admin function error ${err}` };
    }
  }

  /*return property info for a particular property id*/
  async returnPropertyInfo(_property_id) {
    try {
      var data = await this.slf_interface.methods.propInfo(_property_id).call();
      //     console.log(data);
      return data;
    } catch (err) {
      throw { message: `ERROR: check admin function error ${err}` };
    }
  }

  /* set SLC contract address */
  async setSLCContractAddress(account, privatekey, _slcAddress) {
    try {
      var data = await this.slf_interface.methods
        .setSLC_contract_address(_slcAddress)
        .encodeABI();
      privatekey = await this.convPrivateKeyToBuffer(privatekey);
      // console.log(privatekey);
      this.runCode(data, account, privatekey, this.SLFContractAddress);
    } catch {
      throw { message: "ERROR: cann't set SLC contract address" };
    }
  }

  /* Add Property Details EnlistingAdmin*/
  async addPropertyEnlistAdmin(account, privatekey, _newAdmin) {
    try {
      var data = await this.slf_interface.methods
        .addAdmin(_newAdmin)
        .encodeABI();
      privatekey = await this.convPrivateKeyToBuffer(privatekey);
      //     console.log(privatekey);
      this.runCode(data, account, privatekey, this.SLFContractAddress);
    } catch {
      throw { message: "ERROR: cann't add new property enlist admin" };
    }
  }

  /* Delete Property Details EnlistingAdmin*/
  async DeletePropertyEnlistAdmin(account, privatekey, _existingAdmin) {
    try {
      var data = await this.slf_interface.methods
        .delAdmin(_existingAdmin)
        .encodeABI();
      privatekey = await this.convPrivateKeyToBuffer(privatekey);
      //     console.log(privatekey);
      this.runCode(data, account, privatekey, this.SLFContractAddress);
    } catch {
      throw { message: "ERROR: cann't delete property enlist admin" };
    }
  }

  /* Enlist Property Details*/
  async EnlistPropertyDetails(
    AdminPublicAddress,
    AdminPrivateKey,
    _origValue,
    _currValue,
    _coins_issued,
    _equity_at_issuance,
    _varriation,
    _current_coin_value,
    _orig_issue_rate,
    _next_schedule_reevaluation,
    token_uri,
    propertyID,
  ) {
    try {
      var data = await this.slf_interface.methods
        .ListProperty_details(
          _origValue,
          _currValue,
          _coins_issued,
          _equity_at_issuance,
          _varriation,
          _current_coin_value,
          _orig_issue_rate,
          _next_schedule_reevaluation,
          token_uri,
          propertyID,
        )
        .encodeABI();
      AdminPrivateKey = await this.convPrivateKeyToBuffer(AdminPrivateKey);
      //     console.log(AdminPrivateKey);
      this.runCode(
        data,
        AdminPublicAddress,
        AdminPrivateKey,
        this.SLFContractAddress,
      );
    } catch {
      throw { message: "ERROR: cann't delete property enlist admin" };
    }
  }

  /*
   * SLC Contract Functions
   */

  /* set SLF contract address */
  async setSLFContractAddress(account, privatekey, _slfAddress) {
    try {
      var data = await this.slc_interface.methods
        .setSLF_contract_address(_slfAddress)
        .encodeABI();
      privatekey = await this.convPrivateKeyToBuffer(privatekey);
      //     console.log(privatekey);
      this.runCode(data, account, privatekey, this.SLCContractAddress);
    } catch {
      throw { message: "ERROR: cann't set SLF contract address" };
    }
  }

  /* set mintNFT contract address */
  async setmintNFTContractAddress(account, privatekey, _mintNFTAddress) {
    try {
      var data = await this.slc_interface.methods
        .setmintNFT_contract_address(_mintNFTAddress)
        .encodeABI();
      privatekey = await this.convPrivateKeyToBuffer(privatekey);
      //     console.log(privatekey);
      this.runCode(data, account, privatekey, this.SLCContractAddress);
    } catch {
      throw { message: "ERROR: cann't set mintNFT contract address" };
    }
  }

  /* Add Region Admin so that after verifying enlisting transaction tokens transferred to this region admin */
  async setRegionAdmin(account, privatekey, _newRegionNumber, _newRegionAdmin) {
    try {
      var data = await this.slc_interface.methods
        .add_region_admin(_newRegionNumber, _newRegionAdmin)
        .encodeABI();
      privatekey = await this.convPrivateKeyToBuffer(privatekey);
      //     console.log(privatekey);
      this.runCode(data, account, privatekey, this.SLCContractAddress);
    } catch {
      throw { message: "ERROR: cann't set Region Admin" };
    }
  }

  /* change Region Admin so that after verifying enlisting transaction tokens transferred to this region admin */
  async changeRegionAdmin(
    account,
    privatekey,
    _existingRegionNumber,
    _newRegionAdmin,
  ) {
    try {
      var data = await this.slc_interface.methods
        .change_region_admin(_existingRegionNumber, _newRegionAdmin)
        .encodeABI();
      privatekey = await this.convPrivateKeyToBuffer(privatekey);
      //     console.log(privatekey);
      this.runCode(data, account, privatekey, this.SLCContractAddress);
    } catch {
      throw { message: "ERROR: cann't change region admin" };
    }
  }

  /*Remove existing owner and add new owner who can sign the pending transactions*/
  async removeExistAndAddNewOwner(
    account,
    privatekey,
    _existingOwner,
    _newOwner,
  ) {
    try {
      var data = await this.slc_interface.methods
        .modify(_existingOwner, _newOwner)
        .encodeABI();
      privatekey = await this.convPrivateKeyToBuffer(privatekey);
      //     console.log(privatekey);
      this.runCode(data, account, privatekey, this.SLCContractAddress);
    } catch {
      throw { message: "ERROR: cann't remove and add existing and new owner" };
    }
  }

  /*add new owner who can sign the pending transactions*/
  async AddNewOwner(account, privatekey, _newOwner) {
    try {
      var data = await this.slc_interface.methods
        .addOwner(_newOwner)
        .encodeABI();
      privatekey = await this.convPrivateKeyToBuffer(privatekey);
      //     console.log(privatekey);
      this.runCode(data, account, privatekey, this.SLCContractAddress);
    } catch {
      throw { message: "ERROR: cann't add new owner" };
    }
  }

  /*remove existing owner who can sign the pending transactions*/
  async removeOwner(account, privatekey, _newOwner) {
    try {
      var data = await this.slc_interface.methods
        .removeOwner(_newOwner)
        .encodeABI();
      privatekey = await this.convPrivateKeyToBuffer(privatekey);
      this.runCode(data, account, privatekey, this.SLCContractAddress);
    } catch {
      throw { message: "ERROR: cann't remove owner" };
    }
  }

  /*get pending transactions*/
  async getPendingTransactions(TransSignerAddress): Promise<any> {
    try {
      //     console.log(TransSignerAddress);
      var data = await this.slc_interface.methods
        .getPendingTransactions()
        .call({ from: TransSignerAddress });
      //     console.log("Pending Transactions:-",data);
      return data;
    } catch {
      throw { message: "ERROR: cann't get pending transactions" };
    }
  }

  /*get transaction details*/
  async getTransactionDetails(TransSignerAddress, TransID) {
    try {
      var data = await this.slc_interface.methods
        ._transactions(TransID)
        .call({ from: TransSignerAddress });
      //     console.log("Transactions Details:-",data);
      return data;
    } catch {
      throw { message: "ERROR: cann't get pending transactions" };
    }
  }

  /*sign pending transactions*/
  async signPendingTransactions(
    TransSignerAddress,
    TransSignerPrivateKey,
    TransID,
  ) {
    try {
      var data = await this.slc_interface.methods
        .signTransaction(TransID)
        .encodeABI();
      //     console.log(data);
      this.runCode(
        data,
        TransSignerAddress,
        TransSignerPrivateKey,
        this.SLCContractAddress,
      );
    } catch {
      throw { message: "ERROR: cann't sign pending transactions" };
    }
  }

  /*delete pending transactions*/
  async deletePendingTransactions(
    TransSignerAddress,
    TransSignerPrivateKey,
    TransID,
  ) {
    try {
      var data = await this.slc_interface.methods
        .deleteTransaction(TransID)
        .encodeABI();
      //     console.log(data);
      this.runCode(
        data,
        TransSignerAddress,
        TransSignerPrivateKey,
        this.SLCContractAddress,
      );
    } catch {
      throw { message: "ERROR: cann't delete pending transactions" };
    }
  }

  /*
   * mintNFT Contract Functions
   */
  async getTokenURI(tokenid) {
    try {
      var data = await this.mintNFT_interface.methods.tokenURI(tokenid).call();
      // console.log(data);
      return data;
    } catch {
      throw { message: "ERROR: cann't get tokenURI for this token id" };
    }
  }

  checkSLFAdmin = async function(address) {
    return await this.checkAdminOrNot(address);
  };
  propertyInfo = async function(id) {
    return await this.returnPropertyInfo(id);
  };
  addSLFadmin = async function(
    Caller_Address,
    Caller_private_key,
    New_admin_Address,
  ) {
    await this.addPropertyEnlistAdmin(
      Caller_Address,
      Caller_private_key,
      New_admin_Address,
    );
  };
  deleteSLFadmin = async function(
    Caller_Address,
    Caller_private_key,
    Existing_admin_Address,
  ) {
    await this.DeletePropertyEnlistAdmin(
      Caller_Address,
      Caller_private_key,
      Existing_admin_Address,
    );
  };
  enlistPropertyDetails = async function(
    adminAddress,
    adminPrivateKey,
    Original_Value,
    Current_value,
    coins_issued,
    Equity_At_issuance,
    Varriation,
    current_coin_value,
    Orig_issue_rate,
    Next_Schedule_reevaluation,
    tokenuri,
    propertyID,
  ) {
    await this.EnlistPropertyDetails(
      adminAddress,
      adminPrivateKey,
      Original_Value,
      Current_value,
      coins_issued,
      Equity_At_issuance,
      Varriation,
      current_coin_value,
      Orig_issue_rate,
      Next_Schedule_reevaluation,
      tokenuri,
      propertyID,
    );
  };
  removeAndAddOwner = async function(
    Caller_Address,
    Caller_private_key,
    Existing_owner,
    New_Owner,
  ) {
    await this.removeExistAndAddNewOwner(
      Caller_Address,
      Caller_private_key,
      Existing_owner,
      New_Owner,
    );
  };
  addNewOwner = async function(Caller_Address, Caller_private_key, New_Owner) {
    await this.AddNewOwner(Caller_Address, Caller_private_key, New_Owner);
  };
  deleteOwner = async function(
    Caller_Address,
    Caller_private_key,
    existing_Owner,
  ) {
    await this.AddNewOwner(Caller_Address, Caller_private_key, existing_Owner);
  };
  GetPendingTransactions = async function(SignerAddress) {
    return await this.getPendingTransactions(SignerAddress);
  };
  GetTransactionsDetails = async function(SignerAddress, TransactionID) {
    return await this.getTransactionDetails(SignerAddress, TransactionID);
  };
  SignPendingTransactions = async function(
    SignerAddress,
    SignerPrivatekey,
    TransactionID,
  ) {
    return await this.signPendingTransactions(
      SignerAddress,
      SignerPrivatekey,
      TransactionID,
    );
  };
  DeletePendingTransactions = async function(
    SignerAddress,
    SignerPrivatekey,
    TransactionID,
  ) {
    return await this.deletePendingTransactions(
      SignerAddress,
      SignerPrivatekey,
      TransactionID,
    );
  };
  getURIOfToken = async function(tokenid) {
    await this.getTokenURI(tokenid);
  };

  async checkTxInitiatedBySelfIsCompletedOrNot(publicaddress) {
    var txCreated = [],
      txCompleted = [];

    this.slc_interface
      .getPastEvents('TransactionCreated', { fromBlock: 0 })
      .then(data => {
        data.forEach(element => {
          //console.log(element.returnValues.tokenId)
          //console.log(element)
          if (element.returnValues[0] == publicaddress)
            txCreated.push(element.returnValues[3]);
          //console.log(propertyInfo(element.returnValues.tokenId));
        });
      })
      .then(() => {
        this.slc_interface
          .getPastEvents('TransactionCompleted', { fromBlock: 0 })
          .then(data => {
            data.forEach(element => {
              //console.log(element.returnValues.tokenId)
              if (element.returnValues[0] == publicaddress) {
                var index = txCreated.indexOf(element.returnValues[3]);
                //console.log(index)
                txCreated[index] = -1;
              }

              //console.log(propertyInfo(element.returnValues.tokenId));
            });
            //console.log(txCreated)
          })
          .then(() => {
            var ans = [];
            txCreated.forEach(element => {
              if (element != -1) ans.push(element);
            });
            console.log(ans);
            return ans;
          });
      });
  }
  async checkTxInitiatedByOtherIsCompletedOrNot(publicaddress): Promise<any> {
    var txCreated = [],
    txCompleted = [];
    console.log(publicaddress);
    const res = new Promise<any>((resolve, reject) => {
      var data1;
      data1 = new Promise<any>((resolve, reject) => {
        resolve(
          this.slc_interface.getPastEvents('TransactionCreated', {
            fromBlock: 0,
          }),
        );
      });

      resolve(data1);
    });

    const res2 = new Promise<any>((resolve, reject) => {
      let data1;
      data1 = new Promise<any>((resolve, reject) => {
        resolve(
          this.slc_interface.getPastEvents('TransactionCompleted', {
            fromBlock: 0,
          }),
        );
      });
      resolve(data1);
    });

    const res3 = new Promise<any>((resolve, reject) => {
      let data1;
      data1 = new Promise<any>((resolve, reject) => {
        resolve(
          this.slc_interface.getPastEvents('TransactionSigned', {
            fromBlock: 0,
          }),
        );
      });
      resolve(data1);
    });

    var dat = await res.then(response => {
      response.forEach(element => {
        if (element.returnValues[0] != publicaddress)
          txCreated.push(element.returnValues[3]);
      });
      return txCreated;
    });

    console.log(txCreated);

    var dat2 = await res2.then(response => {
      response.forEach(element => {
        if (element.returnValues[0] != publicaddress) {
          var index = txCreated.indexOf(element.returnValues[3]);
          if (index != -1) txCreated[index] = -1;
        }
      });
      return txCreated;
    });

    var signedtransacton = [];
    var dat3 = await res3.then(response => {
      response.forEach(element => {
        let address = element.returnValues[0];
        let transactionId = element.returnValues[1];
        let obj = {
          address: address,
          transactionID: transactionId,
        };
        signedtransacton.push(obj);
      });
      console.log(signedtransacton);
    });
    var ArrOfTransactionInitiatedByOthers = [];
    txCreated.forEach(element => {
      if (element != -1) ArrOfTransactionInitiatedByOthers.push(element);
    });

    return ArrOfTransactionInitiatedByOthers;
  }

  async getwords(word: any) {
    var char4 = word;
  }

  async ServiceGetPendingTransaction(publicAddress: string): Promise<any> {
    var mapping = [];
    var pendingtransaction = await this.getPendingTransactions(publicAddress);
    for (var i = 0; i < pendingtransaction.length; i++) {
      let transaction = await this.getTransactionDetails(
        publicAddress,
        pendingtransaction[i],
      );
      let id = transaction.propertyID;
      let propertyDetail = await this.propertyRepository.findOne({ id });
      console.log(propertyDetail);
      let obj = {
        PropertyID: transaction.propertyID,
        TransactionID: pendingtransaction[i],
        PropertyDetails: propertyDetail,
      };
      mapping.push(obj);
    }
    return mapping;
  }

  async GetTransactionsToBeSigned(publicAddress: string): Promise<any> {
    const res3 = new Promise<any>((resolve, reject) => {
      let data1;
      data1 = new Promise<any>((resolve, reject) => {
        resolve(
          this.slc_interface.getPastEvents('TransactionSigned', {
            fromBlock: 0,
          }),
        );
      });
      resolve(data1);
    });
    // Fetch all the Signed Events.
    var signedtransacton = [];
    var dat3 = await res3.then(response => {
      response.forEach(element => {
        let address = element.returnValues[0];
        let transactionId = element.returnValues[1];
        let obj = {
          address: address,
          transactionID: transactionId,
        };
        signedtransacton.push(obj);
      });
      console.log(signedtransacton);
    });

    // Fetch all the Pending Events

    var pendingtransaction = await this.getPendingTransactions(publicAddress);
    var ListOfTransactionToBeSigned = [];
    var FinalList = [];
    pendingtransaction.forEach(element => {
      FinalList.push(element);
    });
    function getAllIndexes(arr, val) {
      var indexes = [];
      var i = arr.findIndex(obj => obj.transactionID === val);
      while (i != -1) {
        indexes.push(i);
        if (signedtransacton[i].address == publicAddress) {
          var len = pendingtransaction.indexOf(val);
          if (FinalList.length == len + 1) {
            FinalList.pop();
          } else {
            FinalList.splice(len, 1);
          }
        }
        if (signedtransacton.length == i + 1) {
          signedtransacton.pop();
        } else {
          signedtransacton.splice(i, 1);
        }
        i = arr.findIndex(obj => obj.transactionID === val, i + 1);
      }
      return indexes;
    }
    //    This will reduce the FinalList which are pending and not signed by the User
    pendingtransaction.forEach(element => {
      getAllIndexes(signedtransacton, element);
    });

    var mapping = [];
    for (var i = 0; i < FinalList.length; i++) {
      let transaction = await this.getTransactionDetails(
        publicAddress,
        FinalList[i],
      );
      let id = transaction.propertyID;
      let propertyDetail = await this.propertyRepository.findOne({ id });
      let obj = {
        PropertyID: transaction.propertyID,
        TransactionID: FinalList[i],
        PropertyDetails: propertyDetail,
      };
      mapping.push(obj);
    }
    return mapping;
  }

  // Get total properties pending for onboarding

  async getOnboardingDetails(inputIF: onboardingCountIF): Promise<any> {
    try {
      return await getPropertyOnboardCount(inputIF.publicaddress, inputIF.role);
    } catch (err) {
      return new BadRequestException(err.message);
    }
  }
}
