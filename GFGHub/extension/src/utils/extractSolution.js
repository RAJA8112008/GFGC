// src/utils/extractSolution.js
/**
 * Normalise the raw data collected by the content script into the
 * shape expected by the backend.
 *
 * @param {Object} raw - the object stored by gfgDetector.js
 * @returns {Object} - formatted payload ready for pushSolution()
 */
export function formatPayload(raw) {
    // The content script already sends everything we need; this function
    // simply ensures the field names match the backend model.
    return {
        repositoryId: raw.repositoryId, // will be overwritten by popup UI
        problemName: raw.problemName,
        difficulty: raw.difficulty,
        language: raw.language,
        topic: raw.topic,
        code: raw.code,
        problemUrl: raw.problemUrl,
        // optional: views will be added server‑side, not needed here
    };
}
