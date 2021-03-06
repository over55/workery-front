import React, { Component } from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import * as moment from 'moment';

import AdminAssociateAddressUpdateComponent from "../../../../components/associates/admin/update/adminAssociateAddressUpdateComponent";
import { setFlashMessage } from "../../../../actions/flashMessageActions";
import { validateAddressInput } from "../../../../validators/associateValidator";
import { putAssociateAddressDetail } from "../../../../actions/associateActions";


class AdminAssociateAddressUpdateContainer extends Component {
    /**
     *  Initializer & Utility
     *------------------------------------------------------------
     */

    constructor(props) {
        super(props);

        // Since we are using the ``react-routes-dom`` library then we
        // fetch the URL argument as follows.
        const { id } = this.props.match.params;

        // Map the API fields to our fields.
        const country = this.props.associateDetail.addressCountry === "CA" ? "Canada" : this.props.associateDetail.addressCountry;
        const region = this.props.associateDetail.addressRegion === "ON" ? "Ontario" : this.props.associateDetail.addressRegion;

        this.state = {
            // STEP 3
            // typeOf: typeOf,

            // STEP 5
            country: country,
            region: region,
            locality: this.props.associateDetail.addressLocality,
            postalCode: this.props.associateDetail.postalCode,
            streetAddress: this.props.associateDetail.streetAddress,

            // Everything else...
            errors: {},
            isLoading: false,
            id: id,
            fullName: this.props.associateDetail.fullName,
        }

        this.getPostData = this.getPostData.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onSuccessfulSubmissionCallback = this.onSuccessfulSubmissionCallback.bind(this);
        this.onFailedSubmissionCallback = this.onFailedSubmissionCallback.bind(this);
    }

    /**
     *  Utility function used to create the `postData` we will be submitting to
     *  the API; as a result, this function will structure some dictionary key
     *  items under different key names to support our API web-service's API.
     */
    getPostData() {
        let postData = Object.assign({}, this.state);

        // (2) Middle name (API ISSUE)
        postData.middleName = this.state.middleName;

        // (2) Join date - We need to format as per required API format.
        const joinDateMoment = moment(this.state.joinDate);
        postData.joinDate = joinDateMoment.format("YYYY-MM-DD");

        const duesDateMoment = moment(this.state.duesDate);
        postData.duesDate = duesDateMoment.format("YYYY-MM-DD");

        const commercialInsuranceExpiryDateMoment = moment(this.state.commercialInsuranceExpiryDate);
        postData.commercialInsuranceExpiryDate = commercialInsuranceExpiryDateMoment.format("YYYY-MM-DD");

        const autoInsuranceExpiryDateMoment = moment(this.state.autoInsuranceExpiryDate);
        postData.autoInsuranceExpiryDate = autoInsuranceExpiryDateMoment.format("YYYY-MM-DD");

        const wsibInsuranceDateMoment = moment(this.state.wsibInsuranceDatej);
        postData.wsibInsuranceDate = wsibInsuranceDateMoment.format("YYYY-MM-DD");

        const policeCheckMoment = moment(this.state.policeCheckj);
        postData.policeCheck = policeCheckMoment.format("YYYY-MM-DD");

        // (4) How Hear Other - This field may not be null, therefore make blank.
        if (this.state.howHearOther === undefined || this.state.howHearOther === null) {
            postData.howHearOther = "";
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

        // (8) Telephone type: This field is required.;
        postData.telephone = this.state.primaryPhone;
        if (this.state.telephoneTypeOf === undefined || this.state.telephoneTypeOf === null || this.state.telephoneTypeOf === "") {
            postData.telephoneTypeOf = 1;
        }
        postData.otherTelephone = this.state.secondaryPhone;
        if (this.state.otherTelephoneTypeOf === undefined || this.state.otherTelephoneTypeOf === null || this.state.otherTelephoneTypeOf === "") {
            postData.otherTelephoneTypeOf = 1;
        }

        // (9) Address Country: This field is required.
        postData.addressCountry = this.state.country;

        // (10) Address Locality: This field is required.
        postData.addressLocality = this.state.locality;

        // (11) Address Region: This field is required.
        postData.addressRegion = this.state.region

        postData.isActive = true;

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

    onSuccessfulSubmissionCallback(associate) {
        this.setState({ errors: {}, isLoading: true, })
        this.props.setFlashMessage("success", "Associate has been successfully updated.");
        this.props.history.push("/associate/"+this.state.id+"/full");
    }

    onFailedSubmissionCallback(errors) {
        this.setState({ errors: errors, isLoading: false, });

        // The following code will cause the screen to scroll to the top of
        // the page. Please see ``react-scroll`` for more information:
        // https://github.com/fisshy/react-scroll
        var scroll = Scroll.animateScroll;
        scroll.scrollToTop();
    }

    /**
     *  Event handling functions
     *------------------------------------------------------------
     */

    onTextChange(e) {
        // AddressUpdate our state.
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    onSelectChange(option) {
        const optionKey = [option.selectName]+"Option";
        this.setState({
            [option.selectName]: option.value,
            [optionKey]: option,
        });
    }

    onClick(e) {
        // Prevent the default HTML form submit code to run on the browser side.
        e.preventDefault();

        // Perform client-side validation.
        const { errors, isValid } = validateAddressInput(this.state);

        // CASE 1 OF 2: Validation passed successfully.
        if (isValid) {
            this.setState({ errors: {}, isLoading: true}, ()=>{
                this.props.putAssociateAddressDetail(
                    this.getPostData(),
                    this.onSuccessfulSubmissionCallback,
                    this.onFailedSubmissionCallback
                );
            });

        // CASE 2 OF 2: Validation was a failure.
        } else {
            this.onFailedSubmissionCallback(errors);
        }
    }


    /**
     *  Main render function
     *------------------------------------------------------------
     */

    render() {
        const {
            // Step 5
            country, region, locality, postalCode, streetAddress,

            // Everything else...
            errors, id, fullName, isLoading,
        } = this.state;

        return (
            <AdminAssociateAddressUpdateComponent
                // Step 5
                country={country}
                region={region}
                locality={locality}
                postalCode={postalCode}
                streetAddress={streetAddress}

                // Everything else...
                isLoading={isLoading}
                id={id}
                errors={errors}
                onTextChange={this.onTextChange}
                onRadioChange={this.onRadioChange}
                onSelectChange={this.onSelectChange}
                onVehicleTypeMultiChange={this.onVehicleTypeMultiChange}
                onInsuranceRequirementMultiChange={this.onInsuranceRequirementMultiChange}
                onSkillSetMultiChange={this.onSkillSetMultiChange}
                onTagMultiChange={this.onTagMultiChange}
                onClick={this.onClick}
                fullName={fullName}
                isLoading={isLoading}
                associate={this.props.associateDetail}
            />
        );
    }
}

const mapStateToProps = function(store) {
    return {
        user: store.userState,
        associateDetail: store.associateDetailState,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        setFlashMessage: (typeOf, text) => {
            dispatch(setFlashMessage(typeOf, text))
        },
        putAssociateAddressDetail: (data, onSuccessCallback, onFailureCallback) => {
            dispatch(
                putAssociateAddressDetail(data, onSuccessCallback, onFailureCallback)
            )
        },
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminAssociateAddressUpdateContainer);
