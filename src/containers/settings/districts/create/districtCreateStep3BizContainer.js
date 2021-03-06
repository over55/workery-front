import React, { Component } from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import DistrictCreateStep3BizComponent from "../../../../components/settings/districts/create/districtCreateStep3BizComponent";
import { setFlashMessage } from "../../../../actions/flashMessageActions";


class DistrictCreateStep3BusinessContainer extends Component {
    /**
     *  Initializer & Utility
     *------------------------------------------------------------
     */

    constructor(props) {
        super(props);
        this.state = {
            name: localStorage.getItem('nwapp-district-biz-name'),
            description: localStorage.getItem('nwapp-district-biz-description'),
            websiteURL: localStorage.getItem('nwapp-district-biz-websiteURL'),
            logo: JSON.parse(localStorage.getItem('nwapp-district-biz-logo')),
            errors: {},
            isLoading: false
        }

        this.onTextChange = this.onTextChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onSuccessfulSubmissionCallback = this.onSuccessfulSubmissionCallback.bind(this);
        this.onFailedSubmissionCallback = this.onFailedSubmissionCallback.bind(this);
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

    onSuccessfulSubmissionCallback(district) {
        this.setState({ errors: {}, isLoading: true, })
        this.props.setFlashMessage("success", "District has been successfully created.");
        this.props.history.push("/settings/districts");
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

        this.onSuccessfulSubmissionCallback();
        // this.onFailedSubmissionCallback(errors);
    }


    /**
     *  Main render function
     *------------------------------------------------------------
     */

    render() {
        const { name, description, websiteURL, logo, errors, isLoading } = this.state;
        return (
            <DistrictCreateStep3BizComponent
                name={name}
                description={description}
                websiteURL={websiteURL}
                logo={logo}
                errors={errors}
                onTextChange={this.onTextChange}
                onClick={this.onClick}
                onDrop={this.onDrop}
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
        }
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DistrictCreateStep3BusinessContainer);
