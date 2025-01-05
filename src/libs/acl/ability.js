import { Ability } from '@casl/ability'
import { initialAbility } from './config'
import Cookies from "js-cookie";

//  Read ability from localStorage
// * Handles auto fetching previous abilities if already logged in user
// ? You can update this if you store user abilities to more secure place
// ! Anyone can update localStorage so be careful and please update this
const userData = Cookies.get('authData', {domain: import.meta.env.VITE_APP_URL}) ? JSON.parse(Cookies.get('authData', {domain: import.meta.env.VITE_APP_URL})) : null
const existingAbility = userData ? userData.ability : null

export default new Ability(existingAbility || initialAbility)
