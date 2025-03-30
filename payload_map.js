// @ts-check

const CUSTOM_ACTION_APPCACHE_REMOVE = "appcache-remove";

/**
 * @typedef {Object} PayloadInfo
 * @property {string} displayTitle
 * @property {string} description
 * @property {string} fileName - path relative to the payloads folder
 * @property {string} author
 * @property {string} projectSource
 * @property {string} binarySource - should be direct download link to the included version, so that you can verify the hashes
 * @property {string} version
 * @property {string[]?} [supportedFirmwares] - optional, these are interpreted as prefixes, so "" would match all, and "4." would match 4.xx, if not set, the payload is assumed to be compatible with all firmwares
 * @property {number?} [toPort] - optional, if the payload should be sent to "127.0.0.1:<port>" instead of loading directly, if specified it'll show up in webkit-only mode too
 * @property {string?} [customAction]
 */

/**
 * @type {PayloadInfo[]}
*/
const payload_map = [
    // { // auto-loaded
    //     displayTitle: "PS5 Payload ELF Loader",
    //     description: "Uses port 9021. Persistent network elf loader",
    //     fileName: "elfldr.elf",
    //     author: "john-tornblom",
    //     projectSource: "https://github.com/ps5-payload-dev/elfldr",
    //     binarySource: "https://github.com/ps5-payload-dev/pacbrew-repo/actions/runs/13686166926",
    //     version: "0.18.1",
    //     supportedFirmwares: ["1.", "2.", "3.", "4.", "5."]
    // },
    // etaHEN is added twice so that on 1.xx-2.xx you can load it in webkit only mode too
    // but on 3.xx-4.xx it only shows in kernel exploit mode since it needs the 9020 elf loader for kstuff
];
