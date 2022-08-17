import {AuthModel} from './AuthModel'
import {UserAddressModel} from './UserAddressModel'
import {UserCommunicationModel} from './UserCommunicationModel'
import {UserEmailSettingsModel} from './UserEmailSettingsModel'
import {UserSocialNetworksModel} from './UserSocialNetworksModel'

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  designation: string;
  password: string;
}


export interface UserModel {
  _id: string
  username: string
  password: string | undefined
  email: string
  firstName: string
  lastName: string
  industry : string
  fullname?: string
  occupation?: string
  company?: string
  PhoneNumber?: string
  roles?: Array<number>
  pic?: string
  language?: 'en' | 'de' | 'es' | 'fr' | 'ja' | 'zh' | 'ru'
  timeZone?: string
  website?: 'https://keenthemes.com'
  emailSettings?: UserEmailSettingsModel
  auth?: AuthModel
  communication?: UserCommunicationModel
  address?: UserAddressModel
  socialNetworks?: UserSocialNetworksModel
  userCreatedDate: Date
  userLastLoggedIn: Date
  __v: number
}
