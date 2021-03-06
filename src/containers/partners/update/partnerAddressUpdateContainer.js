import React, { Component } from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import PartnerAddressUpdateComponent from "../../../components/partners/update/partnerAddressUpdateComponent";
import { setFlashMessage } from "../../../actions/flashMessageActions";
import { validateAddressInput } from "../../../validators/partnerValidator";
import { putPartnerAddressDetail } from "../../../actions/partnerActions";


class PartnerAddressUpdateContainer extends Component {
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
        const country = this.props.partnerDetail.addressCountry === "CA" ? "Canada" : this.props.partnerDetail.addressCountry;
        const region = this.props.partnerDetail.addressRegion === "ON" ? "Ontario" : this.props.partnerDetail.addressRegion;

        this.state = {
            // Everything else...
            id: id,
            errors: {},
            isLoading: false,

            // STEP 3
            organizationName: this.props.partnerDetail.organizationName,
            givenName: this.props.partnerDetail.givenName,
            lastName: this.props.partnerDetail.lastName,

            // STEP 4
            country: country,
            region: region,
            locality: this.props.partnerDetail.addressLocality,
            postalCode: this.props.partnerDetail.postalCode,
            streetAddress: this.props.partnerDetail.streetAddress,
        }

        this.getPostData = this.getPostData.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
        this.onMultiChange = this.onMultiChange.bind(this);
        this.onDOBDateTimeChange = this.onDOBDateTimeChange.bind(this);
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

    onSuccessfulSubmissionCallback(partner) {
        this.setState({ errors: {}, isLoading: true, })
        this.props.setFlashMessage("success", "Partner has been successfully updated.");
        this.props.history.push("/partner/"+this.state.id+"/full");
    }

    onFailedSubmissionCallback(errors) {
        this.setState({
            errors: errors
        })

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
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    onClick(e) {
        // Prevent the default HTML form submit code to run on the browser side.
        e.preventDefault();

        // Perform partner-side validation.
        const { errors, isValid } = validateAddressInput(this.state);

        // CASE 1 OF 2: Validation passed successfully.
        if (isValid) {
            this.props.putPartnerAddressDetail(
                this.getPostData(),
                this.onSuccessfulSubmissionCallback,
                this.onFailedSubmissionCallback
            );

        // CASE 2 OF 2: Validation was a failure.
        } else {
            this.onFailedSubmissionCallback(errors);
        }
    }

    onSelectChange(option) {
        const optionKey = [option.selectName].toString()+"Option";
        this.setState({
            [option.selectName]: option.value,
            optionKey: option,
        });
        console.log([option.selectName], optionKey, "|",option); // For debugging purposes only.
    }

    onRadioChange(e) {
        // Get the values.
        const storageValueKey = "nwapp-create-partner-"+[e.target.name];
        const value = e.target.value;
        const label = e.target.dataset.label; // Note: 'dataset' is a react data via https://stackoverflow.com/a/20383295
        const storeValueKey = [e.target.name].toString();
        const storeLabelKey = [e.target.name].toString()+"-label";

        // Save the data.
        this.setState({ [e.target.name]: value, }); // Save to store.
        localStorage.setItem(storageValueKey, value) // Save to storage.

        // For the debugging purposes only.
        console.log({
            "STORE-VALUE-KEY": storageValueKey,
            "STORE-VALUE": value,
            "STORAGE-VALUE-KEY": storeValueKey,
            "STORAGE-VALUE": value,
            "STORAGE-LABEL-KEY": storeLabelKey,
            "STORAGE-LABEL": label,
        });
    }

    onMultiChange(...args) {
        // Extract the select options from the parameter.
        const selectedOptions = args[0];

        // Set all the tags we have selected to the STORE.
        this.setState({
            tags: selectedOptions,
        });
    }

    onDOBDateTimeChange(dateOfBirth) {
        this.setState({
            dateOfBirth: dateOfBirth,
        });
    }

    /**
     *  Main render function
     *------------------------------------------------------------
     */

    render() {
        const { isLoading, errors, id } = this.state;
        const {
            // STEP 3
            organizationName, givenName, lastName,

            // STEP 4
            country, region, locality, postalCode, streetAddress,
        } = this.state;
        return (
            <PartnerAddressUpdateComponent
                // Everything else...
                id={id}
                errors={errors}
                isLoading={isLoading}
                onTextChange={this.onTextChange}
                onSelectChange={this.onSelectChange}
                onRadioChange={this.onRadioChange}
                onClick={this.onClick}

                // STEP 3
                organizationName={organizationName}
                givenName={givenName}
                lastName={lastName}

                // STEP 4
                country={country}
                region={region}
                locality={locality}
                streetAddress={streetAddress}
                postalCode={postalCode}
            />
        );
    }
}

const mapStateToProps = function(store) {
    return {
        user: store.userState,
        partnerDetail: store.partnerDetailState,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        setFlashMessage: (typeOf, text) => {
            dispatch(setFlashMessage(typeOf, text))
        },
        putPartnerAddressDetail: (data, onSuccessCallback, onFailureCallback) => {
            dispatch(
                putPartnerAddressDetail(data, onSuccessCallback, onFailureCallback)
            )
        },
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PartnerAddressUpdateContainer);
