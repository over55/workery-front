import React, { Component } from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import * as moment from 'moment';

import StaffMetricsUpdateComponent from "../../../components/staff/update/staffMetricsUpdateComponent";
import { validateMetricsUpdateInput } from "../../../validators/staffValidator";
import { getHowHearReactSelectOptions, pullHowHearList } from "../../../actions/howHearActions";
import { getTagReactSelectOptions, getPickedTagReactSelectOptions, pullTagList } from "../../../actions/tagActions";
import { setFlashMessage } from "../../../actions/flashMessageActions";
import { putStaffMetricsDetail } from '../../../actions/staffActions';


class StaffMetricsUpdateContainer extends Component {
    /**
     *  Initializer & Utility
     *------------------------------------------------------------
     */

    constructor(props) {
        super(props);

        // Since we are using the ``react-routes-dom`` library then we
        // fetch the URL argument as follows.
        const { id } = this.props.match.params;

        const birthdateObj = new Date(this.props.staffDetail.birthdate);
        const joinDateObj = new Date(this.props.staffDetail.joinDate);

        this.state = {
            id: id,
            givenName: this.props.staffDetail.givenName,
            lastName: this.props.staffDetail.lastName,
            isTagsLoading: true,
            tags: this.props.staffDetail.tags,
            dateOfBirth: birthdateObj,
            gender: this.props.staffDetail.gender,
            isHowHearLoading: true,
            howHear: this.props.staffDetail.howHear,
            howHearOther: this.props.staffDetail.howHearOther,
            joinDate: joinDateObj,
            errors: {},
            isLoading: false
        }

        this.getPostData = this.getPostData.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.onDateOfBirthChange = this.onDateOfBirthChange.bind(this);
        this.onJoinDateChange = this.onJoinDateChange.bind(this);
        this.onTagMultiChange = this.onTagMultiChange.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onSuccessfulSubmissionCallback = this.onSuccessfulSubmissionCallback.bind(this);
        this.onFailedSubmissionCallback = this.onFailedSubmissionCallback.bind(this);
        this.onTagsSuccessFetch = this.onTagsSuccessFetch.bind(this);
        this.onHowHearSuccessFetch = this.onHowHearSuccessFetch.bind(this);
    }

    /**
     *  Utility function used to create the `postData` we will be submitting to
     *  the API; as a result, this function will structure some dictionary key
     *  items under different key names to support our API web-service's API.
     */
    getPostData() {
        let postData = Object.assign({}, this.state);

        // (1) birthdate - We need to format as per required API format.
        const dateOfBirth = this.state.dateOfBirth;
        if (dateOfBirth === undefined || dateOfBirth === null || dateOfBirth === "" || isNaN(dateOfBirth) ) {
            const dateOfBirthMoment = moment(dateOfBirth);
            postData.birthdate = dateOfBirthMoment.format("YYYY-MM-DD")
        }

        // (2) Join date - We need to format as per required API format.
        const joinDateMoment = moment(this.state.joinDate);
        postData.joinDate = joinDateMoment.format("YYYY-MM-DD");

        // // (3) Tags - We need to only return our `id` values.
        // let idTags = [];
        // for (let i = 0; i < this.state.tags.length; i++) {
        //     let tag = this.state.tags[i];
        //     idTags.push(tag.value);
        // }
        // postData.tags = idTags;

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

        // Fetch all our GUI drop-down options which are populated by the API.
        const parametersMap = new Map()
        parametersMap.set("isArchived", 3)
        this.props.pullHowHearList(1,1000, parametersMap, this.onHowHearSuccessFetch);
        this.props.pullTagList(1, 1000, parametersMap, this.onTagsSuccessFetch);
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

    onSuccessfulSubmissionCallback(staff) {
        this.props.setFlashMessage("success", "Staff has been successfully updated.");
        this.props.history.push("/staff/"+this.state.id+"/full");
    }

    onFailedSubmissionCallback(errors) {
        this.setState({
            errors: errors
        });

        // The following code will cause the screen to scroll to the top of
        // the page. Please see ``react-scroll`` for more information:
        // https://github.com/fisshy/react-scroll
        var scroll = Scroll.animateScroll;
        scroll.scrollToTop();
    }

    onTagsSuccessFetch(tags) {
        this.setState({ isTagsLoading: false, });
    }

    onHowHearSuccessFetch(howHearList) {
        this.setState({ isHowHearLoading: false, });
    }

    /**
     *  Event handling functions
     *------------------------------------------------------------
     */

    onTextChange(e) {
        this.setState({ [e.target.name]: e.target.value, });
    }

    onSelectChange(option) {
        const optionKey = [option.selectName]+"Option";
        this.setState({
            [option.selectName]: option.value,
            [optionKey]: option,
        });
    }

    onRadioChange(e) {
        // Get the values.
        const storageValueKey = "workery-create-staff-"+[e.target.name];
        const storageLabelKey =  "workery-create-staff-"+[e.target.name].toString()+"-label";
        const value = e.target.value;
        const label = e.target.dataset.label; // Note: 'dataset' is a react data via https://stackoverflow.com/a/20383295
        const storeValueKey = [e.target.name].toString();
        const storeLabelKey = [e.target.name].toString()+"Label";

        // Save the data.
        this.setState({ [e.target.name]: value, }); // Save to store.
        this.setState({ storeLabelKey: label, }); // Save to store.
    }

    onTagMultiChange(...args) {
        // Extract the select options from the parameter.
        const selectedOptions = args[0];

        // We need to only return our `id` values, therefore strip out the
        // `react-select` options format of the data and convert it into an
        // array of integers to hold the primary keys of the `Tag` items selected.
        let idTags = [];
        if (selectedOptions !== null && selectedOptions !== undefined) {
            for (let i = 0; i < selectedOptions.length; i++) {
                let tag = selectedOptions[i];
                idTags.push(tag.value);
            }
        }
        this.setState({ tags: idTags, });
    }

    onDateOfBirthChange(dateObj) {
        this.setState({ dateOfBirth: dateObj, });
    }

    onJoinDateChange(dateObj) {
        this.setState({ joinDate: dateObj, });
    }

    onClick(e) {
        // Prevent the default HTML form submit code to run on the browser side.
        e.preventDefault();

        // console.log(this.state); // For debugging purposes only.

        // Perform staff-side validation.
        const { errors, isValid } = validateMetricsUpdateInput(this.state);

        // CASE 1 OF 2: Validation passed successfully.
        if (isValid) {
            this.props.putStaffMetricsDetail(
                this.getPostData(),
                this.onSuccessfulSubmissionCallback,
                this.onFailedSubmissionCallback
            );

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
            id, givenName, lastName,
            typeOf, isTagsLoading, tags, dateOfBirth, gender, isHowHearLoading, howHear, howHearOther, joinDate,
            errors
        } = this.state;

        const howHearOptions = getHowHearReactSelectOptions(this.props.howHearList);
        const tagOptions = getTagReactSelectOptions(this.props.tagList);
        const transcodedTags = getPickedTagReactSelectOptions(tags, this.props.tagList)

        return (
            <StaffMetricsUpdateComponent
                id={id}
                givenName={givenName}
                lastName={lastName}
                typeOf={typeOf}
                isTagsLoading={isTagsLoading}
                tags={transcodedTags}
                tagOptions={tagOptions}
                dateOfBirth={dateOfBirth}
                gender={gender}
                joinDate={joinDate}
                errors={errors}
                onTextChange={this.onTextChange}
                isHowHearLoading={isHowHearLoading}
                howHear={howHear}
                howHearOptions={howHearOptions}
                howHearOther={howHearOther}
                onSelectChange={this.onSelectChange}
                onRadioChange={this.onRadioChange}
                onTagMultiChange={this.onTagMultiChange}
                onDateOfBirthChange={this.onDateOfBirthChange}
                onJoinDateChange={this.onJoinDateChange}
                onClick={this.onClick}
            />
        );
    }
}

const mapStateToProps = function(store) {
    return {
        user: store.userState,
        tagList: store.tagListState,
        howHearList: store.howHearListState,
        staffDetail: store.staffDetailState,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        pullHowHearList: (page, sizePerPage, map, onSuccessCallback, onFailureCallback) => {
            dispatch(
                pullHowHearList(page, sizePerPage, map, onSuccessCallback, onFailureCallback)
            )
        },
        pullTagList: (page, sizePerPage, map, onSuccessCallback, onFailureCallback) => {
            dispatch(
                pullTagList(page, sizePerPage, map, onSuccessCallback, onFailureCallback)
            )
        },
        setFlashMessage: (typeOf, text) => {
            dispatch(setFlashMessage(typeOf, text))
        },
        putStaffMetricsDetail: (data, onSuccessfulSubmissionCallback, onFailedSubmissionCallback) => {
            dispatch(putStaffMetricsDetail(data, onSuccessfulSubmissionCallback, onFailedSubmissionCallback))
        },
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StaffMetricsUpdateContainer);
