import {
    WORK_ORDER_NEW_STATE,
    WORK_ORDER_DECLINED_STATE,
    WORK_ORDER_PENDING_STATE,
    WORK_ORDER_CANCELLED_STATE,
    WORK_ORDER_ONGOING_STATE,
    WORK_ORDER_IN_PROGRESS_STATE,
    WORK_ORDER_COMPLETED_BUT_UNPAID_STATE,
    WORK_ORDER_COMPLETED_AND_PAID_STATE,
    WORK_ORDER_ARCHIVED_STATE,
    WORK_ORDER_UNASSIGNED_TYPE_OF,
    WORK_ORDER_RESIDENTIAL_TYPE_OF,
    WORK_ORDER_COMMERCIAL_TYPE_OF
} from "./api";

export const WORK_ORDER_NEW_STATE_LABEL = "New";
export const WORK_ORDER_DECLINED_STATE_LABEL = "Declined";
export const WORK_ORDER_PENDING_STATE_LABEL = "Pending";
export const WORK_ORDER_CANCELLED_STATE_LABEL = "Cancelled";
export const WORK_ORDER_ONGOING_STATE_LABEL = "Ongoing";
export const WORK_ORDER_IN_PROGRESS_STATE_LABEL = "In-Progress";
export const WORK_ORDER_COMPLETED_BUT_UNPAID_STATE_LABEL = "Complete but Unpaid";
export const WORK_ORDER_COMPLETED_AND_PAID_STATE_LABEL = "Complete and Paid";
export const WORK_ORDER_ARCHIVED_STATE_LABEL = "Archive";

export const WORK_ORDER_STATE_LABELS = {
    [WORK_ORDER_NEW_STATE]: WORK_ORDER_NEW_STATE_LABEL,
    [WORK_ORDER_DECLINED_STATE]: WORK_ORDER_DECLINED_STATE_LABEL,
    [WORK_ORDER_PENDING_STATE]: WORK_ORDER_PENDING_STATE_LABEL,
    [WORK_ORDER_CANCELLED_STATE]: WORK_ORDER_CANCELLED_STATE_LABEL,
    [WORK_ORDER_ONGOING_STATE]: WORK_ORDER_ONGOING_STATE_LABEL,
    [WORK_ORDER_IN_PROGRESS_STATE]: WORK_ORDER_IN_PROGRESS_STATE_LABEL,
    [WORK_ORDER_COMPLETED_BUT_UNPAID_STATE]: WORK_ORDER_COMPLETED_BUT_UNPAID_STATE_LABEL,
    [WORK_ORDER_COMPLETED_AND_PAID_STATE]: WORK_ORDER_COMPLETED_AND_PAID_STATE_LABEL,
    [WORK_ORDER_ARCHIVED_STATE]: WORK_ORDER_ARCHIVED_STATE_LABEL
}

export function getWorkOrderStateLabel(state) {
    try {
        return WORK_ORDER_STATE_LABELS[state];
    } catch(err) {
        return "-"
    }
}

export const WORK_ORDER_UNASSIGNED_TYPE_OF_LABEL = "Unassigned";
export const WORK_ORDER_RESIDENTIAL_TYPE_OF_LABEL = "Residential";
export const WORK_ORDER_COMMERCIAL_TYPE_OF_LABEL = "Commercial";

export const WORK_ORDER_TYPE_OF_LABELS = {
    [WORK_ORDER_UNASSIGNED_TYPE_OF]: WORK_ORDER_UNASSIGNED_TYPE_OF_LABEL,
    [WORK_ORDER_RESIDENTIAL_TYPE_OF]: WORK_ORDER_RESIDENTIAL_TYPE_OF_LABEL,
    [WORK_ORDER_COMMERCIAL_TYPE_OF]: WORK_ORDER_COMMERCIAL_TYPE_OF_LABEL,
}

export function getWorkOrderTypeOfLabel(state) {
    try {
        return WORK_ORDER_TYPE_OF_LABELS[state];
    } catch(err) {
        return "-"
    }
}