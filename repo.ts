import { IFeedback } from "./model.ts";
import { insert, remove, getAll, get, update } from "./db.ts";

const documentCollection = "feedback";
const documentIdIndex = "feedback_id";
const documentAllIndex = "feedback_all";

function addFeedback(feedback: IFeedback): Promise<IFeedback> {
    return insert(documentCollection, feedback);
}

function removeFeedback(id: string): Promise<IFeedback> {
    return remove(documentIdIndex, id);
}

function getAllFeedback(): Promise<IFeedback[]> {
    return getAll(documentAllIndex);
}

function getFeedback(id: string): Promise<IFeedback> {
    return get(documentIdIndex, id);
}

function updateFeedback(id: string, obj: IFeedback): Promise<IFeedback> {
    return update(documentIdIndex, id, obj);
}

export default { addFeedback, removeFeedback, getAllFeedback, getFeedback, updateFeedback };