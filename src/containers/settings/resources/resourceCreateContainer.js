import React, { Component } from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import ResourceCreateComponent from "../../../components/settings/resources/resourceCreateComponent";
import { setFlashMessage } from "../../../actions/flashMessageActions";
import validateInput from "../../../validators/resourceValidator";
import { RESOURCE_CATEGORY_CHOICES, RESOURCE_TYPE_OF_CHOICES } from "../../../constants/api";


class ResourceCreateContainer extends Component {
    /**
     *  Initializer & Utility
     *------------------------------------------------------------
     */

    constructor(props) {
        super(props);
        this.state = {
            category: "",
            categoryOption: {},
            typeOf: "",
            typeOfOption: {},
            name: "",
            url: "",
            youTubeEmbedCode: "",
            imageFile: null,
            file: null,
            description: "",
            errors: {},
            isLoading: false
        }

        this.onTextChange = this.onTextChange.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.onImageDrop = this.onImageDrop.bind(this);
        this.onFileDrop = this.onFileDrop.bind(this);
        this.onRemoveImageUploadClick = this.onRemoveImageUploadClick.bind(this);
        this.onRemoveFileUploadClick = this.onRemoveFileUploadClick.bind(this);
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

    onSuccessfulSubmissionCallback(resource) {
        this.setState({ errors: {}, isLoading: true, })
        this.props.setFlashMessage("success", "Resource has been successfully created.");
        this.props.history.push("/settings/resources");
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

    onSelectChange(option) {
        const optionKey = [option.selectName]+"Option";
        this.setState({
            [option.selectName]: option.value,
            optionKey: option,
        });
        console.log("optionKey", optionKey);
    }

    onClick(e) {
        // Prevent the default HTML form submit code to run on the browser side.
        e.preventDefault();

        // Perform client-side validation.
        const { errors, isValid } = validateInput(this.state);

        // CASE 1 OF 2: Validation passed successfully.
        if (isValid) {
            this.onSuccessfulSubmissionCallback();

        // CASE 2 OF 2: Validation was a failure.
        } else {
            this.onFailedSubmissionCallback(errors);
        }
    }

    /**
     *  Special Thanks: https://react-dropzone.netlify.com/#previews
     */
    onImageDrop(acceptedFiles) {
        console.log("DEBUG | onImageDrop | acceptedFiles", acceptedFiles);
        const file = acceptedFiles[0];

        // For debuging purposes only.
        console.log("DEBUG | onImageDrop | file", file);

        if (file !== undefined && file !== null) {
            const fileWithPreview = Object.assign(file, {
                preview: URL.createObjectURL(file)
            });

            // For debugging purposes.
            console.log("DEBUG | onImageDrop | fileWithPreview", fileWithPreview);

            // Update our local state to update the GUI.
            this.setState({
                imageFile: fileWithPreview
            })
        }
    }

    onRemoveImageUploadClick(e) {
        // Prevent the default HTML form submit code to run on the browser side.
        e.preventDefault();

        // Clear image.
        this.setState({
            imageFile: null
        })
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
        const { category, typeOf, name, url, youTubeEmbedCode, imageFile, file, description, errors } = this.state;
        return (
            <ResourceCreateComponent
                category={category}
                categoryOptions={RESOURCE_CATEGORY_CHOICES}
                typeOf={typeOf}
                typeOfOptions={RESOURCE_TYPE_OF_CHOICES}
                name={name}
                url={url}
                youTubeEmbedCode={youTubeEmbedCode}
                imageFile={imageFile}
                file={file}
                description={description}
                errors={errors}
                onTextChange={this.onTextChange}
                onSelectChange={this.onSelectChange}
                onImageDrop={this.onImageDrop}
                onFileDrop={this.onFileDrop}
                onRemoveImageUploadClick={this.onRemoveImageUploadClick}
                onRemoveFileUploadClick={this.onRemoveFileUploadClick}
                onClick={this.onClick}
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
)(ResourceCreateContainer);
