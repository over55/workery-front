import React, { Component } from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';

import InvoiceCreateStep3Component from "../../../components/financials/create/invoiceCreateStep3Component";
import { pullOrderDetail } from "../../../actions/orderActions";
import { validateInvoiceSectionThirdInput } from "../../../validators/orderValidator";
import { localStorageGetIntegerItem, localStorageGetDateItem, localStorageSetObjectOrArrayItem } from '../../../helpers/localStorageUtility';
import { putStaffContactDetail } from '../../../actions/staffActions';


class InvoiceCreateStep3Container extends Component {
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
            orderId: parseInt(id),
            invoiceQuoteDays: "",
            invoiceQuoteDate: new Date(),
            invoiceCustomersApproval: "",
            line01Notes: "",
            line02Notes: "",
            paymentAmount: "",
            paymentDate: new Date(),
            cash: false,
            cheque: false,
            debit: false,
            credit: false,
            other: false,
            clientSignature: "",
            associateSignDate: new Date(),
            associateSignature: "",
            errors: {},
            isLoading: false
        }

        this.getPostData = this.getPostData.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.onInvoiceQuoteDateChange = this.onInvoiceQuoteDateChange.bind(this);
        this.onPaymentDateChange = this.onPaymentDateChange.bind(this);
        this.onAssociateSignDateChange = this.onAssociateSignDateChange.bind(this);
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
        this.props.pullOrderDetail(this.state.orderId, this.onSuccessCallback, this.onFailureCallback);
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
        this.props.history.push("/staff/"+this.state.id+"/full");
    }

    onFailedSubmissionCallback(errors) {
        this.setState({ errors: errors, });

        // The following code will cause the screen to scroll to the top of
        // the page. Please see ``react-scroll`` for more information:
        // https://github.com/fisshy/react-scroll
        var scroll = Scroll.animateScroll;
        scroll.scrollToTop();
    }

    onSuccessCallback(response) {
        console.log(response);
        this.setState({ isLoading: false, })
    }

    onFailureCallback(errors) {
        console.log(errors);
    }

    /**
     *  Event handling functions
     *------------------------------------------------------------
     */

    onTextChange(e) {
        this.setState({ [e.target.name]: e.target.value, });
        localStorage.setItem('workery-create-invoice-'+[e.target.name], e.target.value);
    }

    onInvoiceQuoteDateChange(dateObj) {
        this.setState({
            invoiceQuoteDate: dateObj,
        })
        localStorageSetObjectOrArrayItem('workery-create-invoice-invoiceQuoteDate', dateObj);
    }

    onPaymentDateChange(dateObj) {
        this.setState({
            paymentDate: dateObj,
        })
        localStorageSetObjectOrArrayItem('workery-create-invoice-paymentDate', dateObj);
    }

    onAssociateSignDateChange(dateObj) {
        this.setState({
            associateSignDate: dateObj,
        })
        localStorageSetObjectOrArrayItem('workery-create-invoice-associateSignDate', dateObj);
    }

    onClick(e) {
        // Prevent the default HTML form submit code to run on the browser side.
        e.preventDefault();

        // Perform staff-side validation.
        const { errors, isValid } = validateInvoiceSectionThirdInput(this.state);

        // CASE 1 OF 2: Validation passed successfully.
        if (isValid) {
            this.props.history.push("/financial/"+this.state.orderId+"/invoice/create/step-4");

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
            orderId, errors, invoiceQuoteDays, invoiceQuoteDate, invoiceCustomersApproval, line01Notes, line02Notes, paymentAmount, paymentDate,
            cash, cheque, debit, credit, other,
            clientSignature, associateSignDate, associateSignature
        } = this.state;
        return (
            <InvoiceCreateStep3Component
                orderId={orderId}
                order={this.props.orderDetail}
                invoiceQuoteDays={invoiceQuoteDays}
                invoiceQuoteDate={invoiceQuoteDate}
                invoiceCustomersApproval={invoiceCustomersApproval}
                line01Notes={line01Notes}
                line02Notes={line02Notes}
                paymentAmount={paymentAmount}
                paymentDate={paymentDate}
                cash={cash}
                cheque={cheque}
                debit={debit}
                credit={credit}
                other={other}
                clientSignature={clientSignature}
                associateSignDate={associateSignDate}
                associateSignature={associateSignature}
                errors={errors}
                onTextChange={this.onTextChange}
                onRadioChange={this.onRadioChange}
                onSelectChange={this.onSelectChange}
                onInvoiceQuoteDateChange={this.onInvoiceQuoteDateChange}
                onPaymentDateChange={this.onPaymentDateChange}
                onAssociateSignDateChange={this.onAssociateSignDateChange}
                onClick={this.onClick}
            />
        );
    }
}

const mapStateToProps = function(store) {
    return {
        user: store.userState,
        orderDetail: store.orderDetailState,
    };
}

const mapDispatchToProps = dispatch => {
    return {
        putStaffContactDetail: (data, onSuccessfulSubmissionCallback, onFailedSubmissionCallback) => {
            dispatch(putStaffContactDetail(data, onSuccessfulSubmissionCallback, onFailedSubmissionCallback))
        },
        pullOrderDetail: (id, onSuccessCallback, onFailureCallback) => {
            dispatch(
                pullOrderDetail(id, onSuccessCallback, onFailureCallback)
            )
        },
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InvoiceCreateStep3Container);