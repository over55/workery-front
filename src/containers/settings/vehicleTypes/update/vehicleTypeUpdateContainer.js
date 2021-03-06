import React, { Component } from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import VehicleTypeUpdateComponent from "../../../../components/settings/vehicleTypes/update/vehicleTypeUpdateComponent";
import { setFlashMessage } from "../../../../actions/flashMessageActions";
import validateInput from "../../../../validators/vehicleTypeValidator";
import { pullVehicleTypeDetail, putVehicleTypeDetail } from "../../../../actions/vehicleTypeActions";


class VehicleTypeUpdateContainer extends Component {
    /**
     *  Initializer & Utility
     *------------------------------------------------------------
     */

    constructor(props) {
        super(props);

        // Since we are using the ``react-routes-dom`` library then we
        // fetch the URL argument as follows.
        const { id } = this.props.match.params;

        this.state = {
            text: "",
            description: "",
            errors: {},
            isLoading: false,
            id: parseInt(id),
        }

        this.getPostData = this.getPostData.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onSuccessfulSubmissionCallback = this.onSuccessfulSubmissionCallback.bind(this);
        this.onFailedSubmissionCallback = this.onFailedSubmissionCallback.bind(this);
        this.onVehicleTypeFetchedCallback = this.onVehicleTypeFetchedCallback.bind(this);
    }

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
        this.props.pullVehicleTypeDetail(this.state.id, this.onVehicleTypeFetchedCallback)
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

    onSuccessfulSubmissionCallback(vehicleType) {
        this.setState({ errors: {}, isLoading: true, })
        this.props.setFlashMessage("success", "Vehicle type has been successfully updated.");
        this.props.history.push("/settings/vehicle-types");
    }

    onFailedSubmissionCallback(errors) {
        this.setState({
            errors: errors, isLoading: false,
        })

        // The following code will cause the screen to scroll to the top of
        // the page. Please see ``react-scroll`` for more information:
        // https://github.com/fisshy/react-scroll
        var scroll = Scroll.animateScroll;
        scroll.scrollToTop();
    }

    onVehicleTypeFetchedCallback(vehicleTypeDetail) {
        this.setState({
            text: vehicleTypeDetail.text,
            description: vehicleTypeDetail.description,
            isLoading: false,
        });
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

        // Perform client-side validation.
        const { errors, isValid } = validateInput(this.state);

        // CASE 1 OF 2: Validation passed successfully.
        if (isValid) {
            this.setState({
                errors: [], isLoading: true,
            }, ()=>{
                this.props.putVehicleTypeDetail(
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
        const { text, description, errors, isLoading } = this.state;
        return (
            <VehicleTypeUpdateComponent
                text={text}
                description={description}
                errors={errors}
                onTextChange={this.onTextChange}
                onClick={this.onClick}
                isLoading={isLoading}
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
        pullVehicleTypeDetail: (id, onSuccessCallback, onFailureCallback) => {
            dispatch(pullVehicleTypeDetail(id, onSuccessCallback, onFailureCallback))
        },
        putVehicleTypeDetail: (postData, successCallback, failedCallback) => {
            dispatch(putVehicleTypeDetail(postData, successCallback, failedCallback))
        },
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VehicleTypeUpdateContainer);
