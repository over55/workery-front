import React, { Component } from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import * as moment from 'moment';

import StaffCreateStep8Component from "../../../components/staff/create/staffCreateStep8Component";
import { setFlashMessage } from "../../../actions/flashMessageActions";
import {
    localStorageGetObjectItem, localStorageGetArrayItem, localStorageGetDateItem, localStorageGetIntegerItem
} from '../../../helpers/localStorageUtility';
import { RESIDENTIAL_CUSTOMER_TYPE_OF_ID, COMMERCIAL_CUSTOMER_TYPE_OF_ID } from '../../../constants/api';
import { postStaffDetail } from '../../../actions/staffActions';
import { validateStep8CreateInput } from "../../../validators/staffValidator";


class StaffCreateStep8Container extends Component {
    /**
     *  Initializer & Utility
     *------------------------------------------------------------
     */

    constructor(props) {
        super(props);
        const primaryPhone = localStorage.getItem("workery-create-staff-primaryPhone");
        const primaryPhoneTypeOf = localStorageGetIntegerItem("workery-create-staff-primaryPhoneTypeOf");
        const secondaryPhone = localStorage.getItem("workery-create-staff-secondaryPhone");
        const secondaryPhoneTypeOf = localStorageGetIntegerItem("workery-create-staff-secondaryPhoneTypeOf");
        const workEmail = localStorage.getItem("workery-create-staff-workEmail");
        const personalEmail = localStorage.getItem("workery-create-staff-personalEmail");
        const isOkToEmail = localStorageGetIntegerItem("workery-create-staff-isOkToEmail");
        const isOkToText = localStorageGetIntegerItem("workery-create-staff-isOkToText");
        const isOkToEmailLabel = localStorage.getItem("workery-create-staff-isOkToEmail-label");
        const isOkToTextLabel = localStorage.getItem("workery-create-staff-isOkToText-label");

        this.state = {
            // Step 3
            accountType: localStorageGetIntegerItem("workery-create-staff-accountType"),
            accountTypeLabel: "TODO",

            // Step 4 - Residential & Business
            firstName: localStorage.getItem("workery-create-staff-firstName"),
            lastName: localStorage.getItem("workery-create-staff-lastName"),
            primaryPhone: primaryPhone,
            primaryPhoneTypeOf: primaryPhoneTypeOf,
            secondaryPhone: secondaryPhone,
            secondaryPhoneTypeOf: secondaryPhoneTypeOf,
            workEmail: workEmail,
            personalEmail: personalEmail,
            isOkToEmail: isOkToEmail,
            isOkToEmailLabel: isOkToEmailLabel,
            isOkToText: isOkToText,
            isOkToTextLabel: isOkToTextLabel,
            companyName: localStorage.getItem("workery-create-staff-biz-companyName"),
            contactFirstName: localStorage.getItem("workery-create-staff-biz-contactFirstName"),
            contactLastName: localStorage.getItem("workery-create-staff-biz-contactLastName"),

            // Step 5 - Address
            country: localStorage.getItem("workery-create-staff-country"),
            region: localStorage.getItem("workery-create-staff-region"),
            locality: localStorage.getItem("workery-create-staff-locality"),
            postalCode: localStorage.getItem("workery-create-staff-postalCode"),
            streetAddress: localStorage.getItem("workery-create-staff-streetAddress"),

            // Step 6 - Account
            description: localStorage.getItem("workery-create-staff-description"),
            policeCheck: localStorageGetDateItem("workery-create-staff-policeCheck"),
            emergencyContactName: localStorage.getItem("workery-create-staff-emergencyContactName"),
            emergencyContactRelationship: localStorage.getItem("workery-create-staff-emergencyContactRelationship"),
            emergencyContactTelephone: localStorage.getItem("workery-create-staff-emergencyContactTelephone"),
            emergencyContactAlternativeTelephone: localStorage.getItem("workery-create-staff-emergencyContactAlternativeTelephone"),
            password: localStorage.getItem("workery-create-staff-password"),
            passwordRepeat: localStorage.getItem("workery-create-staff-passwordRepeat"),
            isActive: localStorageGetIntegerItem("workery-create-staff-isActive"),

            // Step 7 - Metrics
            tags: localStorageGetArrayItem("workery-create-staff-tags"),
            dateOfBirth: localStorageGetDateItem("workery-create-staff-dateOfBirth"),
            gender: localStorageGetIntegerItem("workery-create-staff-gender"),
            genderLabel: localStorage.getItem("workery-create-staff-gender-label"),
            howHear: localStorageGetIntegerItem("workery-create-staff-howHear"),
            howHearLabel: localStorage.getItem("workery-create-staff-howHearLabel"),
            howHearOption: localStorageGetObjectItem('workery-create-staff-howHearOption'),
            howHearOther: localStorage.getItem("workery-create-staff-howHearOther"),
            joinDate: localStorageGetDateItem("workery-create-staff-joinDate"),
            comment: localStorage.getItem("workery-create-staff-comment"),

            // Everything else
            errors: {},
            isLoading: false,
            password: localStorage.getItem("workery-create-staff-password"),
            passwordRepeat: localStorage.getItem("workery-create-staff-passwordRepeat"),
        }

        this.onSubmitClick = this.onSubmitClick.bind(this);
        this.onSuccessCallback = this.onSuccessCallback.bind(this);
        this.onFailureCallback = this.onFailureCallback.bind(this);
        this.getPostData = this.getPostData.bind(this);
    }

    /**
     *  Utility function used to create the `postData` we will be submitting to
     *  the API; as a result, this function will structure some dictionary key
     *  items under different key names to support our API web-service's API.
     */
    getPostData() {
        let postData = Object.assign({}, this.state);

        // (1) Given name - We need t refactor name for API field match.
        postData.givenName = this.state.firstName;

        // (2) Middle name (API ISSUE)
        postData.middleName = this.state.middleName;

        // (3) Email
        postData.email = this.state.workEmail;

        // (3) Join date - We need to format as per required API format.
        const joinDateMoment = moment(this.state.joinDate);
        postData.joinDate = joinDateMoment.format("YYYY-MM-DD")

        // (2) Join date - We need to format as per required API format.
        const policeCheckMoment = moment(this.state.policeCheck);
        postData.policeCheck = policeCheckMoment.format("YYYY-MM-DD")

        // (3) Tags - We need to only return our `id` values.
        let idTags = [];
        for (let i = 0; i < this.state.tags.length; i++) {
            let tag = this.state.tags[i];
            idTags.push(tag.value);
        }
        postData.tags = idTags;

        // (4) How Hear Other - This field may not be null, therefore make blank.
        if (this.state.howHearOther === undefined || this.state.howHearOther === null) {
            postData.howHearOther = "";
        }

        // (5) Password & Password Repeat
        if (this.state.password === undefined || this.state.password === null || this.state.password === '' || this.state.password.length == 0) {
            var randomString = Math.random().toString(34).slice(-10);
            randomString += "A";
            randomString += "!";
            postData.password = randomString;
            postData.passwordRepeat = randomString;
        }

        // (6) Organization Type Of - This field may not be null, therefore make blank.
        if (this.state.organizationTypeOf === undefined || this.state.organizationTypeOf === null) {
            postData.organizationTypeOf = "";
        }

        // (7) Extra Comment: This field is required.
        if (this.state.comment === undefined || this.state.comment === null) {
            postData.extraComment = "";
        } else {
            postData.extraComment = this.state.comment;
        }

        // () Other telephone type of
        let secondaryPhoneTypeOf = this.state.secondaryPhoneTypeOf;
        if (secondaryPhoneTypeOf === undefined || secondaryPhoneTypeOf === null || isNaN(secondaryPhoneTypeOf) ) {
            secondaryPhoneTypeOf = 1; // Choose default.
        }
        postData.otherTelephoneTypeOf = secondaryPhoneTypeOf;

        // (8) Telephone: This field is required.
        postData.telephone = this.state.primaryPhone;
        postData.telephoneTypeOf = this.state.primaryPhoneTypeOf;

        // (9) Address Country: This field is required.
        postData.addressCountry = this.state.country;

        // (10) Address Locality: This field is required.
        postData.addressLocality = this.state.locality;

        // (11) Address Region: This field is required.
        postData.addressRegion = this.state.region

        // Finally: Return our new modified data.
        console.log("getPostData |", postData);
        return postData;
    }

    /**
     *  Component Life-cycle Management
     *------------------------------------------------------------
     */

    componentDidMount() {
        window.scrollTo(0, 0);  // Start the page at the top of the page.
    }

    componentWillUnmount() {
        // This code will fix the "ReactJS & Redux: Can't perform a React state
        // update on an unmounted component" issue as explained in:
        // https://stackoverflow.com/a/53829700
        this.setState = (state,callback)=>{
            return;
        };
    }

    /**
     *  API callback functions
     *------------------------------------------------------------
     */

    /**
     *  Event handling functions
     *------------------------------------------------------------
     */

    onSubmitClick(e) {
        e.preventDefault();

        const { errors, isValid } = validateStep8CreateInput(this.state);
        // console.log(errors, isValid); // For debugging purposes only.

        if (isValid) {
            this.setState(
                { errors: {}, isLoading: true,},
                ()=>{
                    // Once our state has been validated `staff-side` then we will
                    // make an API request with the server to create our new production.
                    this.props.postStaffDetail(
                        this.getPostData(),
                        this.onSuccessCallback,
                        this.onFailureCallback
                    );
                }
            );
        } else {
            this.setState({
                errors: errors,
                isLoading: false,
            })

            // The following code will cause the screen to scroll to the top of
            // the page. Please see ``react-scroll`` for more information:
            // https://github.com/fisshy/react-scroll
            var scroll = Scroll.animateScroll;
            scroll.scrollToTop();
        }
    }

    onSuccessCallback(response) {
        console.log("onSuccessCallback | State (Post-Fetch):", this.state);
        console.log("onSuccessCallback | Response:",response); // For debugging purposes only.
        this.props.setFlashMessage("success", "Staff has been successfully created.");
        this.props.history.push("/staff");
    }

    onFailureCallback(errors) {
        this.setState({
            errors: errors,
            isLoading: false
        })

        // The following code will cause the screen to scroll to the top of
        // the page. Please see ``react-scroll`` for more information:
        // https://github.com/fisshy/react-scroll
        var scroll = Scroll.animateScroll;
        scroll.scrollToTop();
    }

    /**
     *  Main render function
     *------------------------------------------------------------
     */

    render() {
        const {
            // Step 3
            typeOf,
            typeOfLabel,

            // Step 4 - Residential & Business
            firstName,
            lastName,
            primaryPhone,
            secondaryPhone,
            email,
            isOkToEmail,
            isOkToEmailLabel,
            isOkToText,
            isOkToTextLabel,
            companyName,
            contactFirstName,
            contactLastName,

            // Step 5 - Address
            country,
            region,
            locality,
            postalCode,
            streetAddress,

            // Step 6 - Account
            skillSets,
            insuranceRequirements,
            description,
            hourlySalaryDesired,
            limitSpecial,
            duesDate,
            commercialInsuranceExpiryDate,
            autoInsuranceExpiryDate,
            wsibInsuranceDate,
            policeCheck,
            taxId,
            driversLicenseClass,
            vehicleTypes,
            emergencyContactName,
            emergencyContactRelationship,
            emergencyContactTelephone,
            emergencyContactAlternativeTelephone,
            isActive,

            // Step 7 - Metrics
            tags,
            dateOfBirth,
            gender,
            genderLabel,
            howHear,
            howHearLabel,
            howHearOption,
            howHearOther,
            joinDate,
            comment,

            // Everything else
            errors,
            isLoading,
        } = this.state;

        return (
            <StaffCreateStep8Component
                // Step 3
                typeOf={typeOf}
                typeOfLabel={typeOfLabel}

                // Step 4 - Residential & Business
                firstName={firstName}
                lastName={lastName}
                primaryPhone={primaryPhone}
                secondaryPhone={secondaryPhone}
                email={email}
                isOkToEmail={isOkToEmail}
                isOkToEmailLabel={isOkToEmailLabel}
                isOkToText={isOkToText}
                isOkToTextLabel={isOkToTextLabel}
                companyName={companyName}
                contactFirstName={contactFirstName}
                contactLastName={contactLastName}

                // Step 5 - Address
                country={country}
                region={region}
                locality={locality}
                postalCode={postalCode}
                streetAddress={streetAddress}

                // Step 6 - Account
                skillSets={skillSets}
                insuranceRequirements={insuranceRequirements}
                description={description}
                hourlySalaryDesired={hourlySalaryDesired}
                limitSpecial={limitSpecial}
                duesDate={duesDate}
                commercialInsuranceExpiryDate={commercialInsuranceExpiryDate}
                autoInsuranceExpiryDate={autoInsuranceExpiryDate}
                wsibInsuranceDate={wsibInsuranceDate}
                policeCheck={policeCheck}
                taxId={taxId}
                driversLicenseClass={driversLicenseClass}
                vehicleTypes={vehicleTypes}
                emergencyContactName={emergencyContactName}
                emergencyContactRelationship={emergencyContactRelationship}
                emergencyContactTelephone={emergencyContactTelephone}
                emergencyContactAlternativeTelephone={emergencyContactAlternativeTelephone}
                isActive={isActive}

                // Step 7 - Metrics
                tags={tags}
                dateOfBirth={dateOfBirth}
                gender={gender}
                genderLabel={genderLabel}
                howHear={howHear}
                howHearLabel={howHearLabel}
                howHearOption={howHearOption}
                howHearOther={howHearOther}
                joinDate={joinDate}
                comment={comment}

                // Everything else
                errors={errors}
                isLoading={isLoading}
                onSubmitClick={this.onSubmitClick}
            />
        );
    }
}

const mapStateToProps = function(store) {
    return {
        user: store.userState,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        setFlashMessage: (typeOf, text) => {
            dispatch(setFlashMessage(typeOf, text))
        },
        postStaffDetail: (postData, successCallback, failedCallback) => {
            dispatch(postStaffDetail(postData, successCallback, failedCallback))
        },
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StaffCreateStep8Container);
