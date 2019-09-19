import React, { Component } from 'react';
import { connect } from 'react-redux';
import { camelizeKeys, decamelize } from 'humps';
import Scroll from 'react-scroll';

import OrderListComponent from "../../../../components/clients/retrieve/file_upload/clientFileUploadComponent";
import { postClientFileUpload } from "../../../../actions/clientFileUploadActions";
import { clearFlashMessage } from "../../../../actions/flashMessageActions";
import { validateInput } from "../../../../validators/fileValidator"


class CustomerFileUploadContainer extends Component {
    /**
     *  Initializer & Utility
     *------------------------------------------------------------
     */

    constructor(props) {
        super(props);
        const { id } = this.props.match.params;
        this.state = {
            // Overaly
            isLoading: false,

            // Everything else...
            customer: id,
            file: null,
            id: id,
            text: "",
            errors: {},
        }
        this.getPostData = this.getPostData.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.onSuccessListCallback = this.onSuccessListCallback.bind(this);
        this.onFailureListCallback = this.onFailureListCallback.bind(this);
        this.onSuccessPostCallback = this.onSuccessPostCallback.bind(this);
        this.onFailurePostCallback = this.onFailurePostCallback.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onFileDrop = this.onFileDrop.bind(this);
        this.onRemoveFileUploadClick = this.onRemoveFileUploadClick.bind(this);
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

        // Clear any and all flash messages in our queue to be rendered.
        this.props.clearFlashMessage();
    }

    /**
     *  API callback functions
     *------------------------------------------------------------
     */

    onSuccessListCallback(response) {
        console.log("onSuccessListCallback | State (Pre-Fetch):", this.state);
        this.setState(
            {
                page: response.page,
                totalSize: response.count,
                isLoading: false,
            },
            ()=>{
                console.log("onSuccessListCallback | Fetched:",response); // For debugging purposes only.
                console.log("onSuccessListCallback | State (Post-Fetch):", this.state);
            }
        )
    }

    onFailureListCallback(errors) {
        console.log(errors);
        this.setState({ isLoading: false });
    }

    onSuccessPostCallback(response) {
        console.log("onSuccessListCallback | State (Pre-Fetch):", this.state);
        this.setState(
            {
                page: response.page,
                totalSize: response.count,
                isLoading: false,
            },
            ()=>{
                console.log("onSuccessPostCallback | Fetched:",response); // For debugging purposes only.
                console.log("onSuccessPostCallback | State (Post-Fetch):", this.state);
            }
        )
    }

    onFailurePostCallback(errors) {
        console.log("onFailurePostCallback |", errors);
        this.setState({ isLoading: false, errors: errors, });
    }

    /**
     *  Event handling functions
     *------------------------------------------------------------
     */

    onTextChange(e) {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    onClick(e) {
        e.preventDefault();

        const { errors, isValid } = validateInput(this.state);
        // console.log(errors, isValid); // For debugging purposes only.

        if (isValid) {
            this.setState({
                errors: {},
                isLoading: true,
            }, ()=>{
                // The following code will cause the screen to scroll to the top of
                // the page. Please see ``react-scroll`` for more information:
                // https://github.com/fisshy/react-scroll
                var scroll = Scroll.animateScroll;
                scroll.scrollToTop();

                // Once our state has been validated `client-side` then we will
                // make an API request with the server to create our new production.
                this.props.postClientFileUpload(
                    this.getPostData(),
                    this.onSuccessPostCallback,
                    this.onFailurePostCallback
                );
            });
        } else {
            this.setState({
                errors: errors,
                isLoading: false,
            });

            // The following code will cause the screen to scroll to the top of
            // the page. Please see ``react-scroll`` for more information:
            // https://github.com/fisshy/react-scroll
            var scroll = Scroll.animateScroll;
            scroll.scrollToTop();
        }
    }

    /**
     *  Special Thanks: https://react-dropzone.netlify.com/#previews
     */
    onFileDrop(acceptedFiles) {
        console.log("DEBUG | onFileDrop | acceptedFiles", acceptedFiles);
        const file = acceptedFiles[0];

        // For debuging purposes only.
        console.log("DEBUG | onFileDrop | file", file);

        if (file !== undefined && file !== null) {
            const fileWithPreview = Object.assign(file, {
                preview: URL.createObjectURL(file)
            });

            // For debugging purposes.
            console.log("DEBUG | onFileDrop | fileWithPreview", fileWithPreview);

            // Update our local state to update the GUI.
            this.setState({
                file: fileWithPreview
            })
        }
    }

    onRemoveFileUploadClick(e) {
        // Prevent the default HTML form submit code to run on the browser side.
        e.preventDefault();

        // Clear uploaded file.
        this.setState({
            file: null
        })
    }

    /**
     *  Main render function
     *------------------------------------------------------------
     */

    render() {
        const { isLoading, id, text, errors, file } = this.state;
        const client = this.props.clientDetail ? this.props.clientDetail : {};
        const clientFiles = this.props.clientFileList ? this.props.clientFileList.results : [];
        return (
            <OrderListComponent
                id={id}
                text={text}
                client={client}
                clientFiles={clientFiles}
                flashMessage={this.props.flashMessage}
                onTextChange={this.onTextChange}
                isLoading={isLoading}
                errors={errors}
                onClick={this.onClick}
                file={file}
                onFileDrop={this.onFileDrop}
                onRemoveFileUploadClick={this.onRemoveFileUploadClick}
            />
        );
    }
}

const mapStateToProps = function(store) {
    return {
        user: store.userState,
        flashMessage: store.flashMessageState,
        clientFileList: store.clientFileListState,
        clientDetail: store.clientDetailState,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        clearFlashMessage: () => {
            dispatch(clearFlashMessage())
        },
        postClientFileUpload: (postData, successCallback, failedCallback) => {
            dispatch(postClientFileUpload(postData, successCallback, failedCallback))
        },
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CustomerFileUploadContainer);