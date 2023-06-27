let userId = null;
let firstName = null;
let lastName = null;
let profilePicture = null;
let phone = null;
let email = null;
let balance = null;
let ratings = null;
let gender = null;
let driver = 0;

export function reset() {
    userId = null;
    firstName = null;
    lastName = null;
    profilePicture = null;
    phone = null;
    email = null;
    balance = null;
    ratings = null;
    gender = null;
    driver = 0;
}

export function setUserId(newUserId) {
    userId = newUserId;
}

export function getUserId() {
    return userId;
}

export function setFirstName(newFirstName) {
    firstName = newFirstName;
}

export function getFirstName() {
    return firstName;
}

export function setLastName(newLastName) {
    lastName = newLastName;
}

export function getLastName() {
    return lastName;
}

export function setProfilePicture(newProfilePicture) {
    profilePicture = newProfilePicture;
}

export function getProfilePicture() {
    return profilePicture;
}

export function setPhone(newPhone) {
    phone = newPhone;
}

export function getPhone() {
    return phone;
}

export function setEmail(newEmail) {
    email = newEmail;
}

export function getEmail() {
    return email;
}

export function setBalance(newBalance) {
    balance = newBalance;
}

export function getBalance() {
    return balance;
}

export function setRating(newRating) {
    rating = newRating;
}

export function getRating() {
    return rating;
}

export function setGender(newGender) {
    gender = newGender;
}

export function getGender() {
    return gender;
}

export function setDriver(newDriver) {
    driver = newDriver;
}

export function getDriver() {
    return driver;
}