import validator from 'validator';
import isEmpty from 'lodash/isEmpty';


/**
 *  Validator will validate the register form.
 */
export default function validateInput(data) {
    let errors = {};

    if (data.schema === undefined || data.schema === null || validator.isEmpty(data.schema) || data.schema === "") {
        errors.schema = 'This field is required';
    }
    if (data.name === undefined || data.name === null || validator.isEmpty(data.name) || data.name === "") {
        errors.name = 'This field is required';
    }
    if (data.alternateName === undefined || data.alternateName === null || validator.isEmpty(data.alternateName) || data.alternateName === "") {
        errors.alternateName = 'This field is required';
    }
    if (data.description === undefined || data.description === null || validator.isEmpty(data.description) || data.description === "") {
        errors.description = 'This field is required';
    }
    if (data.country === undefined || data.country === null || validator.isEmpty(data.country) || data.country === "") {
        errors.country = 'This field is required';
    }
    if (data.region === undefined || data.region === null || validator.isEmpty(data.region) || data.region === "") {
        errors.region = 'This field is required';
    }
    if (data.locality === undefined || data.locality === null || validator.isEmpty(data.locality) || data.locality === "") {
        errors.locality = 'This field is required';
    }
    if (data.streetAddress === undefined || data.streetAddress === null || validator.isEmpty(data.streetAddress) || data.streetAddress === "") {
        errors.streetAddress = 'This field is required';
    }
    if (data.postalCode === undefined || data.postalCode === null || validator.isEmpty(data.postalCode) || data.postalCode === "") {
        errors.postalCode = 'This field is required';
    }
    if (data.timezone === undefined || data.timezone === null || validator.isEmpty(data.timezone) || data.timezone === "") {
        errors.timezone = 'This field is required';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}
