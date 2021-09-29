import { BadRequestException, Injectable } from '@nestjs/common';
import { nonceDto, signatureDto, userDto, emailDto, randomUserDTO, blockIpDTO } from './user.dto';
import { IuserNonce, MessageResponse, Role, UserData, UserPassCode, RandomUser } from './user.interface';
import { getUserBy, getUserNonceBy, userNonceRepository, UserRepository, userPassCodeRepository, randomUserRepository } from './user.repository';
import { v4 } from 'uuid';
import { recoverPersonalSignature } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import { AuthService } from '../auth/auth.service';
import { JwtPayload } from '../auth/auth.interface';
import { EmailsService } from '../emails/emails.service'
import { promises } from 'dns';
import * as geoip from 'geoip-lite'
import * as ipstack from 'ipstack'
import IPData from 'ipdata';

@Injectable()
export class UserService {

    constructor(
        public readonly userRepository: UserRepository,
        public readonly userNonceRepository: userNonceRepository,
        public readonly userPassCodeRepository: userPassCodeRepository,
        public readonly randomUserRepository: randomUserRepository,
        public readonly authservice: AuthService,
        public readonly emailsService: EmailsService,

    ) {}

    async signUp({ name, email, publicaddress ,otp}: userDto): Promise<any> {
        try {
            const id = v4();
            var publicaddress = publicaddress;
            var role = Role.General;
            const passCode = await this.getOtp(email);
            if(otp!=passCode) throw new BadRequestException('Incorrect Otp')
            const list = await getUserBy({ email });
            const publiclist = await getUserBy({ publicaddress });
            if (!list && !publiclist) {
                var user: UserData = {
                    id,
                    email,
                    publicaddress,
                    role,
                    name,
                    passCode
                }
                await this.userRepository.insert(user);
                var usernonce: IuserNonce = {
                    id: v4(),
                    nonce: (Math.floor(Math.random() * 10000)).toString(),
                    publicaddress

                }

                await this.userNonceRepository.insert(usernonce);

                return {
                    publicaddress: usernonce.publicaddress,
                    nonce: usernonce.nonce
                };

            }
            else {
                if (list) {
                    var responsType = 401
                } else if (publiclist) {
                    responsType = 402
                }
                switch (responsType) {
                    case 401:
                        throw new BadRequestException("Email already in use,please login to continue");
                        break;
                    case 402:
                        throw new BadRequestException("Publickey already in use,please login to continue")
                        break;
                    default:
                        throw new BadRequestException("Something went wrong, please try again")
                        break;
                }

            }
        }
        catch (err) {

            throw new BadRequestException(err.message);
        }

    }

    // Create admin

    async signupasadmin({ email, publicaddress, name,otp }: userDto): Promise<any> {
        try {
            const id = v4();
            var publicaddress = publicaddress.toLowerCase();
            var role = Role.HOAAdmin;
            // var passCode = await this.getOtp(email);
            const list = await getUserBy({ email });
            const publiclist = await getUserBy({ publicaddress });
            if (!list && !publiclist) {
                var user: UserData = {
                    id,
                    email,
                    publicaddress,
                    role,
                    name,
                    passCode:otp
                }
                await this.userRepository.insert(user);
                var usernonce: IuserNonce = {
                    id: v4(),
                    nonce: (Math.floor(Math.random() * 10000)).toString(),
                    publicaddress
                }
                await this.userNonceRepository.insert(usernonce);
                return {
                    publicaddress: usernonce.publicaddress,
                    nonce: usernonce.nonce
                };

            }
            else {
                if (list) {
                    var responsType = 401
                } else if (publiclist) {
                    responsType = 402
                }
                switch (responsType) {
                    case 401:
                        throw new BadRequestException("Email already in use,please login to continue");
                        break;
                    case 402:
                        throw new BadRequestException("Publickey already in use,please login to continue")
                        break;
                    default:
                        throw new BadRequestException("Something went wrong, please try again")
                        break;
                }

            }
        }
        catch (err) {

            throw new BadRequestException(err.message);
        }

    }
    // Sign up as Treasury

    async signupasTreasury({ email, publicaddress,otp }: userDto): Promise<any> {

        try {
            const id = v4();
            var publicaddress = publicaddress.toLowerCase();
            console.log(publicaddress);
            var role = Role.Treasury;
            // var passCode = await this.getOtp(email);
            const list = await getUserBy({ email });
            const publiclist = await getUserBy({ publicaddress });
            console.log('publiclist',publiclist)
            if (!list && !publiclist) {
                var user: UserData = {
                    id,
                    email,
                    publicaddress,
                    role,
                    passCode:otp
                }
                await this.userRepository.insert(user);
                var usernonce: IuserNonce = {
                    id: v4(),
                    nonce: (Math.floor(Math.random() * 10000)).toString(),
                    publicaddress

                }

                await this.userNonceRepository.insert(usernonce);

                return {
                    publicaddress: usernonce.publicaddress,
                    nonce: usernonce.nonce
                };

            }
            else {
                if (list) {
                    var responsType = 401
                } else if (publiclist) {
                    responsType = 402
                }
                switch (responsType) {
                    case 401:
                        throw new BadRequestException("Email already in use,please login to continue");
                        break;
                    case 402:
                        throw new BadRequestException("Publickey already in use,please login to continue")
                        break;
                    default:
                        throw new BadRequestException("Something went wrong, please try again")
                        break;
                }

            }
        }
        catch (err) {

            throw new BadRequestException(err.message);
        }

    }


    // Update Nonce for particular address

    async updateNonce(publicaddress: string): Promise<MessageResponse> {
        const list = await getUserNonceBy({ publicaddress });
        if (list) {
            let nonce = (Math.floor(Math.random() * 10000)).toString()
            await this.userNonceRepository.update(list.id, { nonce })
        }
        return MessageResponse.Successfull;

    }

    //Get Nonce for particular address
    async getNonce(publicaddress: string): Promise<any> {
        try {
            publicaddress = publicaddress.toLowerCase()
            let user = await getUserBy({ publicaddress });
            if (user && user.isActive == true)
                return [{
                    publicaddress: publicaddress,
                    nonce: (await getUserNonceBy({ publicaddress })).nonce
                }]
            else {
                return []
            }
        } catch (err) {

            throw new BadRequestException(err.message);
        }

    }

    //Get JWT token when nonce is signed
    async auth({ publicaddress, signature }: signatureDto): Promise<any> {

        try {

            let token: string;
            publicaddress = publicaddress.toLocaleLowerCase()
            let user = await getUserNonceBy({ publicaddress });
            var userDB = await getUserBy({ publicaddress });
            if (user) {

                const msg = `I am signing my one-time nonce: ${user.nonce}`;
                const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
                const address = recoverPersonalSignature({
                    data: msgBufferHex,
                    sig: signature,
                });

                if (address.toLowerCase() === publicaddress.toLowerCase()) {

                } else {
                    return null;
                }

                this.updateNonce(publicaddress.toLowerCase());
                let role = userDB.role;
                let email = userDB.email
                let id = userDB.id
                let payload: JwtPayload = {
                    publicaddress,
                    email,
                    role,
                    id
                }

                token = await this.authservice.generateToken(id, publicaddress, email, role)
                let obj = { "accessToken": token };
                return obj;

            } else {
                throw new BadRequestException("Seems you are not registered, Please signUp first");
            }
        } catch (err) {

            throw new BadRequestException(err.message);
        }
    }


    async updateRole(publicaddress: string) {
        return await this.userRepository.update(publicaddress, { role: Role.Treasury })
    }

    async checkEmail({ email, name }: emailDto): Promise<any> {
        try {
            const emailList = await this.userPassCodeRepository.findOne(email);
            const list = await getUserBy({ email });
            if (!list) {
                if (emailList) await this.userPassCodeRepository.delete(email)
                var Number = Math.random().toString();
                let otp = Number.slice(2, 8);
                let passCode: number;
                passCode = parseInt(otp);
                var user: UserPassCode = {
                    email,
                    passCode
                }
                const context = { name, passCode }
                await this.emailsService.sendEmail(email,'Your Codezero2pi identity verifications', context, 'sendOtp.hbs')
                await this.userPassCodeRepository.insert(user);
                return {
                    email: user.email
                }
            }
            else {
                throw new BadRequestException("Email already in use,please login to continue");
            }

        } catch (err) {

            throw new BadRequestException(err.message);
        }
    }

    async getOtp(email: string): Promise<any> {
        let list = await this.userPassCodeRepository.findOne(email);
        let otp = list.passCode;
        return otp;
    }

    async createRuser({ email, userName, mobile, skypeId, telegramId, message }: randomUserDTO): Promise<any> {
        try {
            const id = v4();
            let ruser: RandomUser = {
                id,
                email,
                userName,
                mobile,
                skypeId,
                telegramId,
                message
            }
            await this.randomUserRepository.insert(ruser);
        } catch (err) {
            throw new BadRequestException(err.message)
        }

    }

    async getRuser(id: number): Promise<any> {
        const ruser = await this.randomUserRepository.findOne(id);
        return ruser;
    }


    async blockIp({ ip }: blockIpDTO): Promise<any> {
        var access_key = '4cf61e51bb294395d26af5334efb4478';
        var access = true;
        return new Promise((resolve, reject) => {
            ipstack(ip, access_key, (err, geo) => {
                if (err) reject(err)
                console.log(geo);
                var arrayList = ["United States", "Albania", "Bosnia and Herzegovina", "Belarus", "Congo(DRC)", "Côte d'Ivoire", "Crimea", "Cuba", "Iraq", "Iran", "North Korea", "Liberia", "Macedonia", "Myanmar", "Serbia", "Sudan", "Syria", "Zimbabwe"];
                for (var i = 0; i < arrayList.length; i++) {
                    if (arrayList[i] == geo.country_name || arrayList[i] == geo.city || arrayList[i] == geo.region_name) {
                        access = false
                        resolve({
                            message: "It seems you are accessing www.binance.org from an IP address belonging to one of the following countries: United States of America, Albania, Bosnia and Herzegovina, Belarus, Congo (DRC), Côte d'Ivoire, Crimea, Cuba, Iraq, Iran, North Korea, Liberia, Macedonia, Myanmar, Serbia, Sudan, Syria, Zimbabwe",
                            access: access
                        })
                    }
                }
                resolve({
                    message: "Successfull",
                    access: access
                })

            })

        })
    //     const ipdata = new IPData('1d3d69d10d841c277f77e1103504afbc323e91fb23a038266627f15f');
    //     var access = true;
    //     return new Promise((resolve, reject) => {
    //         ipdata.lookup(ip)
    //             .then(function (geo) {

    //                 console.log(geo)

    //                 var arrayList = ["United States", "Albania", "Bosnia and Herzegovina", "Belarus", "Congo(DRC)", "Côte d'Ivoire", "Crimea", "Cuba", "Iraq", "Iran", "North Korea", "Liberia", "Macedonia", "Myanmar", "Serbia", "Sudan", "Syria", "Zimbabwe"];
    //                 for (var i = 0; i < arrayList.length; i++) {
    //                     if (arrayList[i] == geo.country_name || arrayList[i] == geo.city || arrayList[i] == geo.region) {
    //                         access = false
    //                         resolve({
    //                             message: "It seems you are accessing www.binance.org from an IP address belonging to one of the following countries: United States of America, Albania, Bosnia and Herzegovina, Belarus, Congo (DRC), Côte d'Ivoire, Crimea, Cuba, Iraq, Iran, North Korea, Liberia, Macedonia, Myanmar, Serbia, Sudan, Syria, Zimbabwe",
    //                             access: access
    //                         })

    //                     }


    //                 }
    //                 resolve({
    //                     message: "Successfull",
    //                     access: access
    //                 })
    //                 , error => 
    //                    reject(error.message)
    //             })
    //     });

    }


}




