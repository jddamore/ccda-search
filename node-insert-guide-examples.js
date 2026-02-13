#!/usr/bin/env node
/**
 * Insert anchor tags inside <ul id="guide_examples"> based on a JSON mapping.
 *
 * Usage:
 *   node insert-guide-examples.js /path/to/html/folder /path/to/mapping.json [--mode=append|replace]
 *
 * - Recursively scans .html/.htm files.
 * - For each file, if its basename appears in the JSON mapping, add anchors.
 * - Wraps each anchor in <li> to match typical UL structure.
 * - Creates a .bak backup next to modified files (if not already present).
 *
 * JSON mapping format (examples below):
 * {
 *   "page1.html": [
 *     { "href": "/docs/intro", "text": "Intro Guide" },
 *     { "href": "https://example.com", "text": "External", "target": "_blank", "rel": "noopener" }
 *   ],
 *   "page2.html": {
 *     "href": "#local",
 *     "text": "Local Anchor",
 *     "class": "link--primary"
 *   }
 * }
 *
 * Notes:
 * - If the UL does not exist, it will be created just before the closing </body>.
 * - --mode=replace will clear existing <li> children before inserting new ones.
 * - --mode=append (default) will append to existing items.
 */

const fs = require("fs/promises");
const path = require("path");
const cheerio = require("cheerio");

const HTML_EXTENSIONS = new Set([".html", ".htm"]);

let data = [
  {
    file: "1.3.6.1.4.1.19376.1.5.3.1.1.13.2.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-chief-complaint-section-example.html",
    text: "chief-complaint-section-example",
  },
  {
    file: "1.3.6.1.4.1.19376.1.5.3.1.3.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-reason-for-referral-section-example.html",
    text: "reason-for-referral-section-example",
  },
  {
    file: "1.3.6.1.4.1.19376.1.5.3.1.3.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-referral-note-header-example.html",
    text: "referral-note-header-example",
  },
  {
    file: "1.3.6.1.4.1.19376.1.5.3.1.3.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-transfer-summary-header-example.html",
    text: "transfer-summary-header-example",
  },
  {
    file: "1.3.6.1.4.1.19376.1.5.3.1.3.18.html",
    href: "https://hl7.org/cda/us/ccda/Binary-history-and-physical-header-example.html",
    text: "history-and-physical-header-example",
  },
  {
    file: "1.3.6.1.4.1.19376.1.5.3.1.3.18.html",
    href: "https://hl7.org/cda/us/ccda/Binary-review-of-systems-section-example.html",
    text: "review-of-systems-section-example",
  },
  {
    file: "1.3.6.1.4.1.19376.1.5.3.1.3.26.html",
    href: "https://hl7.org/cda/us/ccda/Binary-hospital-discharge-physical-section-example.html",
    text: "hospital-discharge-physical-section-example",
  },
  {
    file: "1.3.6.1.4.1.19376.1.5.3.1.3.4.html",
    href: "https://hl7.org/cda/us/ccda/Binary-consultation-note-complete-example.html",
    text: "consultation-note-complete-example",
  },
  {
    file: "1.3.6.1.4.1.19376.1.5.3.1.3.4.html",
    href: "https://hl7.org/cda/us/ccda/Binary-history-and-physical-header-example.html",
    text: "history-and-physical-header-example",
  },
  {
    file: "1.3.6.1.4.1.19376.1.5.3.1.3.4.html",
    href: "https://hl7.org/cda/us/ccda/Binary-history-of-present-illness-section-example.html",
    text: "history-of-present-illness-section-example",
  },
  {
    file: "1.3.6.1.4.1.19376.1.5.3.1.3.5.html",
    href: "https://hl7.org/cda/us/ccda/Binary-discharge-summary-header-example.html",
    text: "discharge-summary-header-example",
  },
  {
    file: "1.3.6.1.4.1.19376.1.5.3.1.3.5.html",
    href: "https://hl7.org/cda/us/ccda/Binary-hospital-course-section-example.html",
    text: "hospital-course-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.1.19.html",
    href: "https://hl7.org/cda/us/ccda/Binary-authorization-activity-example.html",
    text: "authorization-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.1.19.html",
    href: "https://hl7.org/cda/us/ccda/Binary-policy-activity-example.html",
    text: "policy-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.1.58.html",
    href: "https://hl7.org/cda/us/ccda/Binary-advance-directive-existence-observation-example.html",
    text: "advance-directive-existence-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.1.58.html",
    href: "https://hl7.org/cda/us/ccda/Binary-advance-directive-observation-example.html",
    text: "advance-directive-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.15.3.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-estimated-date-of-delivery-example.html",
    text: "estimated-date-of-delivery-example",
  },
  {
    file: "2.16.840.1.113883.10.20.15.3.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-pregnancy-status-observation-example.html",
    text: "pregnancy-status-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.15.3.8.html",
    href: "https://hl7.org/cda/us/ccda/Binary-pregnancy-status-observation-example.html",
    text: "pregnancy-status-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.18.2.12.html",
    href: "https://hl7.org/cda/us/ccda/Binary-procedure-disposition-section-example.html",
    text: "procedure-disposition-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.18.2.9.html",
    href: "https://hl7.org/cda/us/ccda/Binary-operative-note-header-example.html",
    text: "operative-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.18.2.9.html",
    href: "https://hl7.org/cda/us/ccda/Binary-procedure-estimated-blood-loss-section-example.html",
    text: "procedure-estimated-blood-loss-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.2.10.html",
    href: "https://hl7.org/cda/us/ccda/Binary-consultation-note-complete-example.html",
    text: "consultation-note-complete-example",
  },
  {
    file: "2.16.840.1.113883.10.20.2.10.html",
    href: "https://hl7.org/cda/us/ccda/Binary-history-and-physical-header-example.html",
    text: "history-and-physical-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.2.10.html",
    href: "https://hl7.org/cda/us/ccda/Binary-physical-exam-section-example.html",
    text: "physical-exam-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.2.5.html",
    href: "https://hl7.org/cda/us/ccda/Binary-general-status-section-example.html",
    text: "general-status-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.2.5.html",
    href: "https://hl7.org/cda/us/ccda/Binary-history-and-physical-header-example.html",
    text: "history-and-physical-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.21.2.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-objective-section-example.html",
    text: "objective-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.21.2.2.html",
    href: "https://hl7.org/cda/us/ccda/Binary-subjective-section-example.html",
    text: "subjective-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.21.3.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-progress-note-header-example.html",
    text: "progress-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.21.3.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-progress-note-serviceevent-example.html",
    text: "progress-note-serviceevent-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.1.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-care-plan-complete-example.html",
    text: "care-plan-complete-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.1.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-ccd-header-example.html",
    text: "ccd-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.1.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-consultation-note-complete-example.html",
    text: "consultation-note-complete-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.1.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-discharge-summary-header-example.html",
    text: "discharge-summary-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.1.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-history-and-physical-header-example.html",
    text: "history-and-physical-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.1.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-operative-note-header-example.html",
    text: "operative-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.1.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-patient-generated-document-informationrecipient.html",
    text: "patient-generated-document-informationrecipient",
  },
  {
    file: "2.16.840.1.113883.10.20.22.1.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-procedure-note-header-example.html",
    text: "procedure-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.1.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-progress-note-header-example.html",
    text: "progress-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.1.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-referral-note-header-example.html",
    text: "referral-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.1.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-transfer-summary-header-example.html",
    text: "transfer-summary-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.1.13.html",
    href: "https://hl7.org/cda/us/ccda/Binary-transfer-summary-header-example.html",
    text: "transfer-summary-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.1.14.html",
    href: "https://hl7.org/cda/us/ccda/Binary-referral-note-header-example.html",
    text: "referral-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.1.15.html",
    href: "https://hl7.org/cda/us/ccda/Binary-care-plan-complete-example.html",
    text: "care-plan-complete-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.1.2.html",
    href: "https://hl7.org/cda/us/ccda/Binary-ccd-header-example.html",
    text: "ccd-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.1.3.html",
    href: "https://hl7.org/cda/us/ccda/Binary-history-and-physical-header-example.html",
    text: "history-and-physical-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.1.4.html",
    href: "https://hl7.org/cda/us/ccda/Binary-consultation-note-complete-example.html",
    text: "consultation-note-complete-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.1.6.html",
    href: "https://hl7.org/cda/us/ccda/Binary-procedure-note-header-example.html",
    text: "procedure-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.1.7.html",
    href: "https://hl7.org/cda/us/ccda/Binary-operative-note-header-example.html",
    text: "operative-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.1.8.html",
    href: "https://hl7.org/cda/us/ccda/Binary-discharge-summary-header-example.html",
    text: "discharge-summary-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.1.9.html",
    href: "https://hl7.org/cda/us/ccda/Binary-progress-note-header-example.html",
    text: "progress-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.1.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-ccd-header-example.html",
    text: "ccd-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.1.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-consultation-note-complete-example.html",
    text: "consultation-note-complete-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.1.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-history-and-physical-header-example.html",
    text: "history-and-physical-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.1.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medications-section-example.html",
    text: "medications-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.1.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-referral-note-header-example.html",
    text: "referral-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.1.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-transfer-summary-header-example.html",
    text: "transfer-summary-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.10.html",
    href: "https://hl7.org/cda/us/ccda/Binary-discharge-summary-header-example.html",
    text: "discharge-summary-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.10.html",
    href: "https://hl7.org/cda/us/ccda/Binary-plan-of-treatment-section-example.html",
    text: "plan-of-treatment-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.10.html",
    href: "https://hl7.org/cda/us/ccda/Binary-referral-note-header-example.html",
    text: "referral-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.11.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-discharge-medications-section-example.html",
    text: "discharge-medications-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.11.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-discharge-summary-header-example.html",
    text: "discharge-summary-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.12.html",
    href: "https://hl7.org/cda/us/ccda/Binary-consultation-note-complete-example.html",
    text: "consultation-note-complete-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.12.html",
    href: "https://hl7.org/cda/us/ccda/Binary-history-and-physical-header-example.html",
    text: "history-and-physical-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.12.html",
    href: "https://hl7.org/cda/us/ccda/Binary-reason-for-visit-section-example.html",
    text: "reason-for-visit-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.13.html",
    href: "https://hl7.org/cda/us/ccda/Binary-chief-complaint-and-reason-for-visit-section-example.html",
    text: "chief-complaint-and-reason-for-visit-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.14.html",
    href: "https://hl7.org/cda/us/ccda/Binary-functional-status-section-example.html",
    text: "functional-status-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.14.html",
    href: "https://hl7.org/cda/us/ccda/Binary-referral-note-header-example.html",
    text: "referral-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.15.html",
    href: "https://hl7.org/cda/us/ccda/Binary-family-history-section-example.html",
    text: "family-history-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.15.html",
    href: "https://hl7.org/cda/us/ccda/Binary-history-and-physical-header-example.html",
    text: "history-and-physical-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.16.html",
    href: "https://hl7.org/cda/us/ccda/Binary-hospital-discharge-studies-summary-section-example.html",
    text: "hospital-discharge-studies-summary-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.17.html",
    href: "https://hl7.org/cda/us/ccda/Binary-ccd-header-example.html",
    text: "ccd-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.17.html",
    href: "https://hl7.org/cda/us/ccda/Binary-history-and-physical-header-example.html",
    text: "history-and-physical-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.17.html",
    href: "https://hl7.org/cda/us/ccda/Binary-social-history-section-example.html",
    text: "social-history-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.17.html",
    href: "https://hl7.org/cda/us/ccda/Binary-transfer-summary-header-example.html",
    text: "transfer-summary-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.18.html",
    href: "https://hl7.org/cda/us/ccda/Binary-payers-section-example.html",
    text: "payers-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.2.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-immunizations-section-example.html",
    text: "immunizations-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.20.html",
    href: "https://hl7.org/cda/us/ccda/Binary-history-and-physical-header-example.html",
    text: "history-and-physical-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.20.html",
    href: "https://hl7.org/cda/us/ccda/Binary-past-medical-history-example.html",
    text: "past-medical-history-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.21.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-advance-directives-section-example.html",
    text: "advance-directives-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.22.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-ccd-header-example.html",
    text: "ccd-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.22.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-encounters-section-example.html",
    text: "encounters-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.22.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-transfer-summary-header-example.html",
    text: "transfer-summary-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.23.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medical-equipment-section-example.html",
    text: "medical-equipment-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.24.html",
    href: "https://hl7.org/cda/us/ccda/Binary-discharge-diagnosis-section-example.html",
    text: "discharge-diagnosis-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.24.html",
    href: "https://hl7.org/cda/us/ccda/Binary-discharge-summary-header-example.html",
    text: "discharge-summary-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.25.html",
    href: "https://hl7.org/cda/us/ccda/Binary-anesthesia-section-example.html",
    text: "anesthesia-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.25.html",
    href: "https://hl7.org/cda/us/ccda/Binary-operative-note-header-example.html",
    text: "operative-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.27.html",
    href: "https://hl7.org/cda/us/ccda/Binary-operative-note-header-example.html",
    text: "operative-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.27.html",
    href: "https://hl7.org/cda/us/ccda/Binary-procedure-description-section-example.html",
    text: "procedure-description-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.27.html",
    href: "https://hl7.org/cda/us/ccda/Binary-procedure-note-header-example.html",
    text: "procedure-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.28.html",
    href: "https://hl7.org/cda/us/ccda/Binary-operative-note-header-example.html",
    text: "operative-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.28.html",
    href: "https://hl7.org/cda/us/ccda/Binary-procedure-findings-section-example.html",
    text: "procedure-findings-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.29.html",
    href: "https://hl7.org/cda/us/ccda/Binary-procedure-indications-section-example.html",
    text: "procedure-indications-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.29.html",
    href: "https://hl7.org/cda/us/ccda/Binary-procedure-note-header-example.html",
    text: "procedure-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.3.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-ccd-header-example.html",
    text: "ccd-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.3.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-consultation-note-complete-example.html",
    text: "consultation-note-complete-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.3.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-discharge-summary-header-example.html",
    text: "discharge-summary-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.3.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-history-and-physical-header-example.html",
    text: "history-and-physical-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.3.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-referral-note-header-example.html",
    text: "referral-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.3.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-results-section-example.html",
    text: "results-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.3.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-transfer-summary-header-example.html",
    text: "transfer-summary-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.30.html",
    href: "https://hl7.org/cda/us/ccda/Binary-planned-procedure-section-example.html",
    text: "planned-procedure-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.31.html",
    href: "https://hl7.org/cda/us/ccda/Binary-operative-note-header-example.html",
    text: "operative-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.31.html",
    href: "https://hl7.org/cda/us/ccda/Binary-procedure-specimens-taken-section-example.html",
    text: "procedure-specimens-taken-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.34.html",
    href: "https://hl7.org/cda/us/ccda/Binary-operative-note-header-example.html",
    text: "operative-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.34.html",
    href: "https://hl7.org/cda/us/ccda/Binary-preoperative-diagnosis-section-example.html",
    text: "preoperative-diagnosis-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.35.html",
    href: "https://hl7.org/cda/us/ccda/Binary-operative-note-header-example.html",
    text: "operative-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.35.html",
    href: "https://hl7.org/cda/us/ccda/Binary-postoperative-diagnosis-section-example.html",
    text: "postoperative-diagnosis-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.36.html",
    href: "https://hl7.org/cda/us/ccda/Binary-postprocedure-diagnosis-section-example.html",
    text: "postprocedure-diagnosis-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.36.html",
    href: "https://hl7.org/cda/us/ccda/Binary-procedure-note-header-example.html",
    text: "procedure-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.37.html",
    href: "https://hl7.org/cda/us/ccda/Binary-complications-section-example.html",
    text: "complications-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.37.html",
    href: "https://hl7.org/cda/us/ccda/Binary-operative-note-header-example.html",
    text: "operative-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.37.html",
    href: "https://hl7.org/cda/us/ccda/Binary-procedure-note-header-example.html",
    text: "procedure-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.38.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medications-administered-section-example.html",
    text: "medications-administered-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.4.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-ccd-header-example.html",
    text: "ccd-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.4.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-history-and-physical-header-example.html",
    text: "history-and-physical-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.4.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-transfer-summary-header-example.html",
    text: "transfer-summary-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.4.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-vital-signs-section-example.html",
    text: "vital-signs-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.40.html",
    href: "https://hl7.org/cda/us/ccda/Binary-procedure-implants-section-example.html",
    text: "procedure-implants-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.41.html",
    href: "https://hl7.org/cda/us/ccda/Binary-hospital-discharge-instructions-section-example.html",
    text: "hospital-discharge-instructions-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.42.html",
    href: "https://hl7.org/cda/us/ccda/Binary-discharge-summary-header-example.html",
    text: "discharge-summary-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.42.html",
    href: "https://hl7.org/cda/us/ccda/Binary-hospital-consultations-section-example.html",
    text: "hospital-consultations-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.43.html",
    href: "https://hl7.org/cda/us/ccda/Binary-admission-diagnosis-section-example.html",
    text: "admission-diagnosis-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.45.html",
    href: "https://hl7.org/cda/us/ccda/Binary-instructions-section-example.html",
    text: "instructions-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.5.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-ccd-header-example.html",
    text: "ccd-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.5.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-consultation-note-complete-example.html",
    text: "consultation-note-complete-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.5.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-history-and-physical-header-example.html",
    text: "history-and-physical-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.5.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-no-known-problems-section-example.html",
    text: "no-known-problems-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.5.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-problem-section-example.html",
    text: "problem-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.5.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-referral-note-header-example.html",
    text: "referral-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.5.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-transfer-summary-header-example.html",
    text: "transfer-summary-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.500.html",
    href: "https://hl7.org/cda/us/ccda/Binary-care-teams-section-example.html",
    text: "care-teams-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.56.html",
    href: "https://hl7.org/cda/us/ccda/Binary-mental-status-section-example.html",
    text: "mental-status-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.56.html",
    href: "https://hl7.org/cda/us/ccda/Binary-referral-note-header-example.html",
    text: "referral-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.57.html",
    href: "https://hl7.org/cda/us/ccda/Binary-nutrition-section-example.html",
    text: "nutrition-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.57.html",
    href: "https://hl7.org/cda/us/ccda/Binary-referral-note-header-example.html",
    text: "referral-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.58.html",
    href: "https://hl7.org/cda/us/ccda/Binary-care-plan-complete-example.html",
    text: "care-plan-complete-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.58.html",
    href: "https://hl7.org/cda/us/ccda/Binary-health-concerns-section-example.html",
    text: "health-concerns-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.6.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergies-and-intolerances-section-example.html",
    text: "allergies-and-intolerances-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.6.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-to-food-egg.html",
    text: "allergy-to-food-egg",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.6.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-ccd-header-example.html",
    text: "ccd-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.6.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-consultation-note-complete-example.html",
    text: "consultation-note-complete-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.6.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-discharge-summary-header-example.html",
    text: "discharge-summary-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.6.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-history-and-physical-header-example.html",
    text: "history-and-physical-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.6.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-referral-note-header-example.html",
    text: "referral-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.6.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-transfer-summary-header-example.html",
    text: "transfer-summary-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.60.html",
    href: "https://hl7.org/cda/us/ccda/Binary-care-plan-complete-example.html",
    text: "care-plan-complete-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.60.html",
    href: "https://hl7.org/cda/us/ccda/Binary-goals-section-example.html",
    text: "goals-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.61.html",
    href: "https://hl7.org/cda/us/ccda/Binary-care-plan-complete-example.html",
    text: "care-plan-complete-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.61.html",
    href: "https://hl7.org/cda/us/ccda/Binary-outcomes-section-example.html",
    text: "outcomes-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.64.html",
    href: "https://hl7.org/cda/us/ccda/Binary-course-of-care-section-example.html",
    text: "course-of-care-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.65.html",
    href: "https://hl7.org/cda/us/ccda/Binary-note-section-example.html",
    text: "note-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.65.html",
    href: "https://hl7.org/cda/us/ccda/Binary-progress-note-header-example.html",
    text: "progress-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.7.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-discharge-summary-header-example.html",
    text: "discharge-summary-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.7.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-note-activity-as-entryrelationship-to-ccda-entry-example.html",
    text: "note-activity-as-entryrelationship-to-ccda-entry-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.7.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-note-activity-as-standalone-entry-example.html",
    text: "note-activity-as-standalone-entry-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.7.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-procedures-section-example.html",
    text: "procedures-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.8.html",
    href: "https://hl7.org/cda/us/ccda/Binary-assessment-section-example.html",
    text: "assessment-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.8.html",
    href: "https://hl7.org/cda/us/ccda/Binary-referral-note-header-example.html",
    text: "referral-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.9.html",
    href: "https://hl7.org/cda/us/ccda/Binary-assessment-and-plan-section-example.html",
    text: "assessment-and-plan-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.9.html",
    href: "https://hl7.org/cda/us/ccda/Binary-consultation-note-complete-example.html",
    text: "consultation-note-complete-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.9.html",
    href: "https://hl7.org/cda/us/ccda/Binary-history-and-physical-header-example.html",
    text: "history-and-physical-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.9.html",
    href: "https://hl7.org/cda/us/ccda/Binary-procedure-note-header-example.html",
    text: "procedure-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.9.html",
    href: "https://hl7.org/cda/us/ccda/Binary-progress-note-header-example.html",
    text: "progress-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.2.9.html",
    href: "https://hl7.org/cda/us/ccda/Binary-transfer-summary-header-example.html",
    text: "transfer-summary-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-result-organizer-example.html",
    text: "result-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-results-section-example.html",
    text: "results-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.109.html",
    href: "https://hl7.org/cda/us/ccda/Binary-characteristics-of-home-environment-example.html",
    text: "characteristics-of-home-environment-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.109.html",
    href: "https://hl7.org/cda/us/ccda/Binary-social-history-section-example.html",
    text: "social-history-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.110.html",
    href: "https://hl7.org/cda/us/ccda/Binary-progress-toward-goal-observation-example.html",
    text: "progress-toward-goal-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.111.html",
    href: "https://hl7.org/cda/us/ccda/Binary-cultural-and-religious-observation-example.html",
    text: "cultural-and-religious-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.111.html",
    href: "https://hl7.org/cda/us/ccda/Binary-social-history-section-example.html",
    text: "social-history-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.113.html",
    href: "https://hl7.org/cda/us/ccda/Binary-prognosis-coded-example.html",
    text: "prognosis-coded-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.113.html",
    href: "https://hl7.org/cda/us/ccda/Binary-prognosis-free-text-example.html",
    text: "prognosis-free-text-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.114.html",
    href: "https://hl7.org/cda/us/ccda/Binary-longitudinal-care-wound-observation-example.html",
    text: "longitudinal-care-wound-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.115.html",
    href: "https://hl7.org/cda/us/ccda/Binary-external-document-reference-example.html",
    text: "external-document-reference-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.118.html",
    href: "https://hl7.org/cda/us/ccda/Binary-substance-administered-act-example.html",
    text: "substance-administered-act-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-advance-directive-existence-observation-example.html",
    text: "advance-directive-existence-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-advance-directive-observation-example.html",
    text: "advance-directive-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergies-and-intolerances-section-example.html",
    text: "allergies-and-intolerances-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-concern-act-example.html",
    text: "allergy-concern-act-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-intolerance-observation-drugclass-example.html",
    text: "allergy-intolerance-observation-drugclass-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-intolerance-observation-medication-example.html",
    text: "allergy-intolerance-observation-medication-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-intolerance-observation-nonmedication-example.html",
    text: "allergy-intolerance-observation-nonmedication-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-to-food-egg.html",
    text: "allergy-to-food-egg",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-assessment-and-plan-section-example.html",
    text: "assessment-and-plan-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-average-bp-example.html",
    text: "average-bp-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-basic-industry-observation-example.html",
    text: "basic-industry-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-basic-occupation-observation-example.html",
    text: "basic-occupation-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-birth-sex-example.html",
    text: "birth-sex-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-comment-activity-example.html",
    text: "comment-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-encounter-diagnosis-example.html",
    text: "encounter-diagnosis-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-functional-status-observation-example.html",
    text: "functional-status-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-functional-status-organizer-example.html",
    text: "functional-status-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-goal-observation-example.html",
    text: "goal-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-goals-section-example.html",
    text: "goals-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-handoff-communication-example.html",
    text: "handoff-communication-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-hospital-admission-diagnosis-example.html",
    text: "hospital-admission-diagnosis-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-hospital-discharge-diagnosis-example.html",
    text: "hospital-discharge-diagnosis-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medication-activity-example.html",
    text: "medication-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medications-section-example.html",
    text: "medications-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-new-author-participant-example.html",
    text: "new-author-participant-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-no-known-problems-section-example.html",
    text: "no-known-problems-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-note-activity-as-entryrelationship-to-ccda-entry-example.html",
    text: "note-activity-as-entryrelationship-to-ccda-entry-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-note-activity-as-standalone-entry-example.html",
    text: "note-activity-as-standalone-entry-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-planned-medication-activity-example.html",
    text: "planned-medication-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-postprocedure-diagnosis-example.html",
    text: "postprocedure-diagnosis-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-postprocedure-diagnosis-section-example.html",
    text: "postprocedure-diagnosis-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-preoperative-diagnosis-example.html",
    text: "preoperative-diagnosis-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-preoperative-diagnosis-section-example.html",
    text: "preoperative-diagnosis-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-priority-preference-example.html",
    text: "priority-preference-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-problem-concern-act-example.html",
    text: "problem-concern-act-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-problem-observation-example.html",
    text: "problem-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-problem-observation-postcoordsnomed-example.html",
    text: "problem-observation-postcoordsnomed-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-problem-section-example.html",
    text: "problem-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-progress-note-header-example.html",
    text: "progress-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-referral-act-example.html",
    text: "referral-act-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-result-observation-example.html",
    text: "result-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-result-organizer-example.html",
    text: "result-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-results-section-example.html",
    text: "results-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-self-care-activities-adl-and-iadl-example.html",
    text: "self-care-activities-adl-and-iadl-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-sensory-and-speech-status-example.html",
    text: "sensory-and-speech-status-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-sexual-orientation-observation-example.html",
    text: "sexual-orientation-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-sexual-orientation-observation-nullflavor-example.html",
    text: "sexual-orientation-observation-nullflavor-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-smoking-status-meaningful-use-example.html",
    text: "smoking-status-meaningful-use-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-social-history-observation-example.html",
    text: "social-history-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-social-history-section-example.html",
    text: "social-history-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-tobacco-use-example.html",
    text: "tobacco-use-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-transfer-summary-header-example.html",
    text: "transfer-summary-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-tribal-affiliation-example.html",
    text: "tribal-affiliation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-vital-sign-observation-example.html",
    text: "vital-sign-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.119.html",
    href: "https://hl7.org/cda/us/ccda/Binary-vital-signs-organizer-example.html",
    text: "vital-signs-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.120.html",
    href: "https://hl7.org/cda/us/ccda/Binary-planned-immunization-activity.html",
    text: "planned-immunization-activity",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.121.html",
    href: "https://hl7.org/cda/us/ccda/Binary-goal-observation-example.html",
    text: "goal-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.121.html",
    href: "https://hl7.org/cda/us/ccda/Binary-goals-section-example.html",
    text: "goals-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.121.html",
    href: "https://hl7.org/cda/us/ccda/Binary-intervention-act-moodcodeint-example.html",
    text: "intervention-act-moodcodeint-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.121.html",
    href: "https://hl7.org/cda/us/ccda/Binary-outcome-observation-example.html",
    text: "outcome-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.121.html",
    href: "https://hl7.org/cda/us/ccda/Binary-outcomes-section-example.html",
    text: "outcomes-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.121.html",
    href: "https://hl7.org/cda/us/ccda/Binary-planned-intervention-act-example.html",
    text: "planned-intervention-act-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.122.html",
    href: "https://hl7.org/cda/us/ccda/Binary-diagnosis-reference-example.html",
    text: "diagnosis-reference-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.122.html",
    href: "https://hl7.org/cda/us/ccda/Binary-entry-reference-example.html",
    text: "entry-reference-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.122.html",
    href: "https://hl7.org/cda/us/ccda/Binary-goal-observation-example.html",
    text: "goal-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.122.html",
    href: "https://hl7.org/cda/us/ccda/Binary-goals-section-example.html",
    text: "goals-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.122.html",
    href: "https://hl7.org/cda/us/ccda/Binary-intervention-act-moodcodeint-example.html",
    text: "intervention-act-moodcodeint-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.122.html",
    href: "https://hl7.org/cda/us/ccda/Binary-outcome-observation-example.html",
    text: "outcome-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.122.html",
    href: "https://hl7.org/cda/us/ccda/Binary-outcomes-section-example.html",
    text: "outcomes-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.122.html",
    href: "https://hl7.org/cda/us/ccda/Binary-planned-intervention-act-example.html",
    text: "planned-intervention-act-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.122.html",
    href: "https://hl7.org/cda/us/ccda/Binary-risk-concern-act-example.html",
    text: "risk-concern-act-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.123.html",
    href: "https://hl7.org/cda/us/ccda/Binary-drug-monitoring-act-example.html",
    text: "drug-monitoring-act-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.124.html",
    href: "https://hl7.org/cda/us/ccda/Binary-nutritional-status-observation-example.html",
    text: "nutritional-status-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.124.html",
    href: "https://hl7.org/cda/us/ccda/Binary-nutrition-section-example.html",
    text: "nutrition-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.127.html",
    href: "https://hl7.org/cda/us/ccda/Binary-functional-status-section-example.html",
    text: "functional-status-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.127.html",
    href: "https://hl7.org/cda/us/ccda/Binary-sensory-and-speech-status-example.html",
    text: "sensory-and-speech-status-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.128.html",
    href: "https://hl7.org/cda/us/ccda/Binary-functional-status-organizer-example.html",
    text: "functional-status-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.128.html",
    href: "https://hl7.org/cda/us/ccda/Binary-functional-status-section-example.html",
    text: "functional-status-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.128.html",
    href: "https://hl7.org/cda/us/ccda/Binary-self-care-activities-adl-and-iadl-example.html",
    text: "self-care-activities-adl-and-iadl-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.129.html",
    href: "https://hl7.org/cda/us/ccda/Binary-planned-coverage-example.html",
    text: "planned-coverage-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.130.html",
    href: "https://hl7.org/cda/us/ccda/Binary-nutrition-recommendation-example.html",
    text: "nutrition-recommendation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.131.html",
    href: "https://hl7.org/cda/us/ccda/Binary-intervention-act-moodcodeint-example.html",
    text: "intervention-act-moodcodeint-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.132.html",
    href: "https://hl7.org/cda/us/ccda/Binary-entry-reference-example.html",
    text: "entry-reference-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.132.html",
    href: "https://hl7.org/cda/us/ccda/Binary-health-concern-act-example.html",
    text: "health-concern-act-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.132.html",
    href: "https://hl7.org/cda/us/ccda/Binary-health-concerns-section-example.html",
    text: "health-concerns-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.133.html",
    href: "https://hl7.org/cda/us/ccda/Binary-wound-measurement-observation-example.html",
    text: "wound-measurement-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.134.html",
    href: "https://hl7.org/cda/us/ccda/Binary-wound-characteristic-example.html",
    text: "wound-characteristic-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.135.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medical-equipment-organizer-example.html",
    text: "medical-equipment-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.136.html",
    href: "https://hl7.org/cda/us/ccda/Binary-risk-concern-act-example.html",
    text: "risk-concern-act-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.138.html",
    href: "https://hl7.org/cda/us/ccda/Binary-nutritional-status-observation-example.html",
    text: "nutritional-status-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.138.html",
    href: "https://hl7.org/cda/us/ccda/Binary-nutrition-assessment-example.html",
    text: "nutrition-assessment-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.138.html",
    href: "https://hl7.org/cda/us/ccda/Binary-nutrition-section-example.html",
    text: "nutrition-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.14.html",
    href: "https://hl7.org/cda/us/ccda/Binary-anesthesia-section-example.html",
    text: "anesthesia-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.14.html",
    href: "https://hl7.org/cda/us/ccda/Binary-intervention-act-moodcodeint-example.html",
    text: "intervention-act-moodcodeint-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.14.html",
    href: "https://hl7.org/cda/us/ccda/Binary-note-activity-as-entryrelationship-to-ccda-entry-example.html",
    text: "note-activity-as-entryrelationship-to-ccda-entry-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.14.html",
    href: "https://hl7.org/cda/us/ccda/Binary-note-activity-as-standalone-entry-example.html",
    text: "note-activity-as-standalone-entry-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.14.html",
    href: "https://hl7.org/cda/us/ccda/Binary-procedure-activity-procedure-example.html",
    text: "procedure-activity-procedure-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.14.html",
    href: "https://hl7.org/cda/us/ccda/Binary-procedures-section-example.html",
    text: "procedures-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.140.html",
    href: "https://hl7.org/cda/us/ccda/Binary-reason-for-referral-section-example.html",
    text: "reason-for-referral-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.140.html",
    href: "https://hl7.org/cda/us/ccda/Binary-referral-act-example.html",
    text: "referral-act-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.141.html",
    href: "https://hl7.org/cda/us/ccda/Binary-handoff-communication-example.html",
    text: "handoff-communication-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.141.html",
    href: "https://hl7.org/cda/us/ccda/Binary-plan-of-treatment-section-example.html",
    text: "plan-of-treatment-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.143.html",
    href: "https://hl7.org/cda/us/ccda/Binary-goal-observation-example.html",
    text: "goal-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.143.html",
    href: "https://hl7.org/cda/us/ccda/Binary-priority-preference-example.html",
    text: "priority-preference-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.144.html",
    href: "https://hl7.org/cda/us/ccda/Binary-outcome-observation-example.html",
    text: "outcome-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.144.html",
    href: "https://hl7.org/cda/us/ccda/Binary-outcomes-section-example.html",
    text: "outcomes-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.145.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-intolerance-observation-medication-example.html",
    text: "allergy-intolerance-observation-medication-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.145.html",
    href: "https://hl7.org/cda/us/ccda/Binary-criticality-observation-example.html",
    text: "criticality-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.146.html",
    href: "https://hl7.org/cda/us/ccda/Binary-planned-intervention-act-example.html",
    text: "planned-intervention-act-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.147.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medication-free-text-sig-example.html",
    text: "medication-free-text-sig-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.16.html",
    href: "https://hl7.org/cda/us/ccda/Binary-admission-medication-example.html",
    text: "admission-medication-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.16.html",
    href: "https://hl7.org/cda/us/ccda/Binary-anesthesia-section-example.html",
    text: "anesthesia-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.16.html",
    href: "https://hl7.org/cda/us/ccda/Binary-discharge-medication-example.html",
    text: "discharge-medication-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.16.html",
    href: "https://hl7.org/cda/us/ccda/Binary-discharge-medications-section-example.html",
    text: "discharge-medications-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.16.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medication-activity-example.html",
    text: "medication-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.16.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medications-administered-section-example.html",
    text: "medications-administered-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.16.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medications-section-example.html",
    text: "medications-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.16.html",
    href: "https://hl7.org/cda/us/ccda/Binary-no-known-medications-example.html",
    text: "no-known-medications-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.17.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medication-supply-order-example.html",
    text: "medication-supply-order-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.18.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medication-dispense-example.html",
    text: "medication-dispense-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.19.html",
    href: "https://hl7.org/cda/us/ccda/Binary-encounter-activity-example.html",
    text: "encounter-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.19.html",
    href: "https://hl7.org/cda/us/ccda/Binary-indication-example.html",
    text: "indication-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.19.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medication-activity-example.html",
    text: "medication-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.19.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medications-section-example.html",
    text: "medications-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.19.html",
    href: "https://hl7.org/cda/us/ccda/Binary-procedure-indications-section-example.html",
    text: "procedure-indications-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.2.html",
    href: "https://hl7.org/cda/us/ccda/Binary-result-observation-example.html",
    text: "result-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.2.html",
    href: "https://hl7.org/cda/us/ccda/Binary-result-organizer-example.html",
    text: "result-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.2.html",
    href: "https://hl7.org/cda/us/ccda/Binary-results-section-example.html",
    text: "results-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.20.html",
    href: "https://hl7.org/cda/us/ccda/Binary-instructions-section-example.html",
    text: "instructions-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.200.html",
    href: "https://hl7.org/cda/us/ccda/Binary-birth-sex-example.html",
    text: "birth-sex-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.200.html",
    href: "https://hl7.org/cda/us/ccda/Binary-birth-sex-example-nullflavor.html",
    text: "birth-sex-example-nullflavor",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.202.html",
    href: "https://hl7.org/cda/us/ccda/Binary-note-activity-as-entryrelationship-to-ccda-entry-example.html",
    text: "note-activity-as-entryrelationship-to-ccda-entry-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.202.html",
    href: "https://hl7.org/cda/us/ccda/Binary-note-activity-as-standalone-entry-example.html",
    text: "note-activity-as-standalone-entry-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.202.html",
    href: "https://hl7.org/cda/us/ccda/Binary-note-section-example.html",
    text: "note-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.202.html",
    href: "https://hl7.org/cda/us/ccda/Binary-progress-note-header-example.html",
    text: "progress-note-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.23.html",
    href: "https://hl7.org/cda/us/ccda/Binary-admission-medication-example.html",
    text: "admission-medication-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.23.html",
    href: "https://hl7.org/cda/us/ccda/Binary-discharge-medication-example.html",
    text: "discharge-medication-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.23.html",
    href: "https://hl7.org/cda/us/ccda/Binary-discharge-medications-section-example.html",
    text: "discharge-medications-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.23.html",
    href: "https://hl7.org/cda/us/ccda/Binary-indication-example.html",
    text: "indication-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.23.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medication-activity-example.html",
    text: "medication-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.23.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medication-dispense-example.html",
    text: "medication-dispense-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.23.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medication-information-example.html",
    text: "medication-information-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.23.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medications-section-example.html",
    text: "medications-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.23.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medication-supply-order-example.html",
    text: "medication-supply-order-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.23.html",
    href: "https://hl7.org/cda/us/ccda/Binary-no-known-medications-example.html",
    text: "no-known-medications-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.23.html",
    href: "https://hl7.org/cda/us/ccda/Binary-planned-medication-activity-example.html",
    text: "planned-medication-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.23.html",
    href: "https://hl7.org/cda/us/ccda/Binary-planned-supply-example.html",
    text: "planned-supply-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.24.html",
    href: "https://hl7.org/cda/us/ccda/Binary-drug-vehicle-example.html",
    text: "drug-vehicle-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.25.html",
    href: "https://hl7.org/cda/us/ccda/Binary-precondition-for-substance-administration-example.html",
    text: "precondition-for-substance-administration-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.26.html",
    href: "https://hl7.org/cda/us/ccda/Binary-vital-signs-organizer-example.html",
    text: "vital-signs-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.26.html",
    href: "https://hl7.org/cda/us/ccda/Binary-vital-signs-section-example.html",
    text: "vital-signs-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.27.html",
    href: "https://hl7.org/cda/us/ccda/Binary-average-bp-example.html",
    text: "average-bp-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.27.html",
    href: "https://hl7.org/cda/us/ccda/Binary-vital-sign-observation-example.html",
    text: "vital-sign-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.27.html",
    href: "https://hl7.org/cda/us/ccda/Binary-vital-signs-organizer-example.html",
    text: "vital-signs-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.27.html",
    href: "https://hl7.org/cda/us/ccda/Binary-vital-signs-section-example.html",
    text: "vital-signs-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.281.html",
    href: "https://hl7.org/cda/us/ccda/Binary-pregnancy-intention-in-next-year-example.html",
    text: "pregnancy-intention-in-next-year-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.3.html",
    href: "https://hl7.org/cda/us/ccda/Binary-no-known-problems-section-example.html",
    text: "no-known-problems-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.3.html",
    href: "https://hl7.org/cda/us/ccda/Binary-problem-concern-act-example.html",
    text: "problem-concern-act-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.3.html",
    href: "https://hl7.org/cda/us/ccda/Binary-problem-section-example.html",
    text: "problem-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.30.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergies-and-intolerances-section-example.html",
    text: "allergies-and-intolerances-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.30.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-concern-act-example.html",
    text: "allergy-concern-act-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.30.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-to-food-egg.html",
    text: "allergy-to-food-egg",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.301.html",
    href: "https://hl7.org/cda/us/ccda/Binary-brand-name-observation-example.html",
    text: "brand-name-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.301.html",
    href: "https://hl7.org/cda/us/ccda/Binary-udi-organizer-example.html",
    text: "udi-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.302.html",
    href: "https://hl7.org/cda/us/ccda/Binary-catalog-number-observation-example.html",
    text: "catalog-number-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.302.html",
    href: "https://hl7.org/cda/us/ccda/Binary-udi-organizer-example.html",
    text: "udi-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.303.html",
    href: "https://hl7.org/cda/us/ccda/Binary-company-name-example.html",
    text: "company-name-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.303.html",
    href: "https://hl7.org/cda/us/ccda/Binary-udi-organizer-example.html",
    text: "udi-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.304.html",
    href: "https://hl7.org/cda/us/ccda/Binary-device-identifier-observation-example.html",
    text: "device-identifier-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.304.html",
    href: "https://hl7.org/cda/us/ccda/Binary-udi-organizer-example.html",
    text: "udi-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.305.html",
    href: "https://hl7.org/cda/us/ccda/Binary-implantable-device-status-observation-example.html",
    text: "implantable-device-status-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.305.html",
    href: "https://hl7.org/cda/us/ccda/Binary-udi-organizer-example.html",
    text: "udi-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.308.html",
    href: "https://hl7.org/cda/us/ccda/Binary-distinct-identification-code-observation-example.html",
    text: "distinct-identification-code-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.308.html",
    href: "https://hl7.org/cda/us/ccda/Binary-udi-organizer-example.html",
    text: "udi-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.309.html",
    href: "https://hl7.org/cda/us/ccda/Binary-udi-organizer-example.html",
    text: "udi-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.31.html",
    href: "https://hl7.org/cda/us/ccda/Binary-age-observation-example.html",
    text: "age-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.31.html",
    href: "https://hl7.org/cda/us/ccda/Binary-family-history-observation-example.html",
    text: "family-history-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.311.html",
    href: "https://hl7.org/cda/us/ccda/Binary-udi-organizer-example.html",
    text: "udi-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.314.html",
    href: "https://hl7.org/cda/us/ccda/Binary-latex-safety-observation-example.html",
    text: "latex-safety-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.314.html",
    href: "https://hl7.org/cda/us/ccda/Binary-udi-organizer-example.html",
    text: "udi-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.315.html",
    href: "https://hl7.org/cda/us/ccda/Binary-lot-or-batch-number-observation-example.html",
    text: "lot-or-batch-number-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.315.html",
    href: "https://hl7.org/cda/us/ccda/Binary-udi-organizer-example.html",
    text: "udi-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.316.html",
    href: "https://hl7.org/cda/us/ccda/Binary-manufacturing-date-observation-example.html",
    text: "manufacturing-date-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.316.html",
    href: "https://hl7.org/cda/us/ccda/Binary-udi-organizer-example.html",
    text: "udi-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.317.html",
    href: "https://hl7.org/cda/us/ccda/Binary-model-number-observation-example.html",
    text: "model-number-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.317.html",
    href: "https://hl7.org/cda/us/ccda/Binary-udi-organizer-example.html",
    text: "udi-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.318.html",
    href: "https://hl7.org/cda/us/ccda/Binary-mri-safety-observation-example.html",
    text: "mri-safety-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.318.html",
    href: "https://hl7.org/cda/us/ccda/Binary-udi-organizer-example.html",
    text: "udi-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.319.html",
    href: "https://hl7.org/cda/us/ccda/Binary-serial-number-observation-example.html",
    text: "serial-number-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.319.html",
    href: "https://hl7.org/cda/us/ccda/Binary-udi-organizer-example.html",
    text: "udi-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.32.html",
    href: "https://hl7.org/cda/us/ccda/Binary-encounter-activity-example.html",
    text: "encounter-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.32.html",
    href: "https://hl7.org/cda/us/ccda/Binary-service-delivery-location-example.html",
    text: "service-delivery-location-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.33.html",
    href: "https://hl7.org/cda/us/ccda/Binary-diagnosis-reference-example.html",
    text: "diagnosis-reference-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.33.html",
    href: "https://hl7.org/cda/us/ccda/Binary-discharge-diagnosis-section-example.html",
    text: "discharge-diagnosis-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.33.html",
    href: "https://hl7.org/cda/us/ccda/Binary-hospital-discharge-diagnosis-example.html",
    text: "hospital-discharge-diagnosis-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.34.html",
    href: "https://hl7.org/cda/us/ccda/Binary-admission-diagnosis-section-example.html",
    text: "admission-diagnosis-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.34.html",
    href: "https://hl7.org/cda/us/ccda/Binary-hospital-admission-diagnosis-example.html",
    text: "hospital-admission-diagnosis-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.35.html",
    href: "https://hl7.org/cda/us/ccda/Binary-discharge-medication-example.html",
    text: "discharge-medication-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.35.html",
    href: "https://hl7.org/cda/us/ccda/Binary-discharge-medications-section-example.html",
    text: "discharge-medications-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.36.html",
    href: "https://hl7.org/cda/us/ccda/Binary-admission-medication-example.html",
    text: "admission-medication-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.37.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medical-equipment-section-example.html",
    text: "medical-equipment-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.37.html",
    href: "https://hl7.org/cda/us/ccda/Binary-non-medicinal-supply-activity-example.html",
    text: "non-medicinal-supply-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.37.html",
    href: "https://hl7.org/cda/us/ccda/Binary-product-instance-example.html",
    text: "product-instance-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.38.html",
    href: "https://hl7.org/cda/us/ccda/Binary-basic-industry-observation-example.html",
    text: "basic-industry-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.38.html",
    href: "https://hl7.org/cda/us/ccda/Binary-basic-occupation-observation-example.html",
    text: "basic-occupation-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.38.html",
    href: "https://hl7.org/cda/us/ccda/Binary-social-history-observation-example.html",
    text: "social-history-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.38.html",
    href: "https://hl7.org/cda/us/ccda/Binary-social-history-section-example.html",
    text: "social-history-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.38.html",
    href: "https://hl7.org/cda/us/ccda/Binary-tribal-affiliation-example.html",
    text: "tribal-affiliation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.4.html",
    href: "https://hl7.org/cda/us/ccda/Binary-admission-diagnosis-section-example.html",
    text: "admission-diagnosis-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.4.html",
    href: "https://hl7.org/cda/us/ccda/Binary-discharge-diagnosis-section-example.html",
    text: "discharge-diagnosis-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.4.html",
    href: "https://hl7.org/cda/us/ccda/Binary-encounter-diagnosis-example.html",
    text: "encounter-diagnosis-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.4.html",
    href: "https://hl7.org/cda/us/ccda/Binary-entry-reference-example.html",
    text: "entry-reference-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.4.html",
    href: "https://hl7.org/cda/us/ccda/Binary-hospital-admission-diagnosis-example.html",
    text: "hospital-admission-diagnosis-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.4.html",
    href: "https://hl7.org/cda/us/ccda/Binary-hospital-discharge-diagnosis-example.html",
    text: "hospital-discharge-diagnosis-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.4.html",
    href: "https://hl7.org/cda/us/ccda/Binary-indication-example.html",
    text: "indication-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.4.html",
    href: "https://hl7.org/cda/us/ccda/Binary-longitudinal-care-wound-observation-example.html",
    text: "longitudinal-care-wound-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.4.html",
    href: "https://hl7.org/cda/us/ccda/Binary-no-known-problems-section-example.html",
    text: "no-known-problems-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.4.html",
    href: "https://hl7.org/cda/us/ccda/Binary-postprocedure-diagnosis-example.html",
    text: "postprocedure-diagnosis-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.4.html",
    href: "https://hl7.org/cda/us/ccda/Binary-postprocedure-diagnosis-section-example.html",
    text: "postprocedure-diagnosis-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.4.html",
    href: "https://hl7.org/cda/us/ccda/Binary-preoperative-diagnosis-example.html",
    text: "preoperative-diagnosis-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.4.html",
    href: "https://hl7.org/cda/us/ccda/Binary-preoperative-diagnosis-section-example.html",
    text: "preoperative-diagnosis-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.4.html",
    href: "https://hl7.org/cda/us/ccda/Binary-problem-concern-act-example.html",
    text: "problem-concern-act-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.4.html",
    href: "https://hl7.org/cda/us/ccda/Binary-problem-observation-example.html",
    text: "problem-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.4.html",
    href: "https://hl7.org/cda/us/ccda/Binary-problem-observation-postcoordsnomed-example.html",
    text: "problem-observation-postcoordsnomed-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.4.html",
    href: "https://hl7.org/cda/us/ccda/Binary-problem-section-example.html",
    text: "problem-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.4.html",
    href: "https://hl7.org/cda/us/ccda/Binary-procedure-findings-section-example.html",
    text: "procedure-findings-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.4.html",
    href: "https://hl7.org/cda/us/ccda/Binary-risk-concern-act-example.html",
    text: "risk-concern-act-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.40.html",
    href: "https://hl7.org/cda/us/ccda/Binary-planned-encounter-example.html",
    text: "planned-encounter-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.40.html",
    href: "https://hl7.org/cda/us/ccda/Binary-plan-of-treatment-section-example.html",
    text: "plan-of-treatment-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.41.html",
    href: "https://hl7.org/cda/us/ccda/Binary-assessment-and-plan-section-example.html",
    text: "assessment-and-plan-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.41.html",
    href: "https://hl7.org/cda/us/ccda/Binary-planned-procedure-example.html",
    text: "planned-procedure-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.41.html",
    href: "https://hl7.org/cda/us/ccda/Binary-planned-procedure-section-example.html",
    text: "planned-procedure-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.415.html",
    href: "https://hl7.org/cda/us/ccda/Binary-result-organizer-example.html",
    text: "result-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.415.html",
    href: "https://hl7.org/cda/us/ccda/Binary-specimen-collection-procedure-example.html",
    text: "specimen-collection-procedure-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.42.html",
    href: "https://hl7.org/cda/us/ccda/Binary-planned-medication-activity-example.html",
    text: "planned-medication-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.421.html",
    href: "https://hl7.org/cda/us/ccda/Binary-result-organizer-example.html",
    text: "result-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.421.html",
    href: "https://hl7.org/cda/us/ccda/Binary-specimen-collection-procedure-example.html",
    text: "specimen-collection-procedure-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.421.html",
    href: "https://hl7.org/cda/us/ccda/Binary-specimen-condition-observation-example.html",
    text: "specimen-condition-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.43.html",
    href: "https://hl7.org/cda/us/ccda/Binary-planned-supply-example.html",
    text: "planned-supply-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.45.html",
    href: "https://hl7.org/cda/us/ccda/Binary-family-history-organizer-example.html",
    text: "family-history-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.45.html",
    href: "https://hl7.org/cda/us/ccda/Binary-family-history-section-example.html",
    text: "family-history-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.46.html",
    href: "https://hl7.org/cda/us/ccda/Binary-family-history-observation-example.html",
    text: "family-history-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.46.html",
    href: "https://hl7.org/cda/us/ccda/Binary-family-history-organizer-example.html",
    text: "family-history-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.47.html",
    href: "https://hl7.org/cda/us/ccda/Binary-family-history-death-observation-example.html",
    text: "family-history-death-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.47.html",
    href: "https://hl7.org/cda/us/ccda/Binary-family-history-observation-example.html",
    text: "family-history-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.47.html",
    href: "https://hl7.org/cda/us/ccda/Binary-family-history-organizer-example.html",
    text: "family-history-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.48.html",
    href: "https://hl7.org/cda/us/ccda/Binary-advance-directive-existence-observation-example.html",
    text: "advance-directive-existence-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.48.html",
    href: "https://hl7.org/cda/us/ccda/Binary-advance-directive-observation-example.html",
    text: "advance-directive-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.49.html",
    href: "https://hl7.org/cda/us/ccda/Binary-care-team-member-act-example.html",
    text: "care-team-member-act-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.49.html",
    href: "https://hl7.org/cda/us/ccda/Binary-encounter-activity-example.html",
    text: "encounter-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.49.html",
    href: "https://hl7.org/cda/us/ccda/Binary-encounters-section-example.html",
    text: "encounters-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.5.html",
    href: "https://hl7.org/cda/us/ccda/Binary-health-concerns-section-example.html",
    text: "health-concerns-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.5.html",
    href: "https://hl7.org/cda/us/ccda/Binary-health-status-observation-example.html",
    text: "health-status-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.50.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medical-equipment-organizer-example.html",
    text: "medical-equipment-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.50.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medical-equipment-section-example.html",
    text: "medical-equipment-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.50.html",
    href: "https://hl7.org/cda/us/ccda/Binary-non-medicinal-supply-activity-example.html",
    text: "non-medicinal-supply-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.500.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-care-team-member-act-example.html",
    text: "care-team-member-act-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.500.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-care-team-organizer-example.html",
    text: "care-team-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.500.2.html",
    href: "https://hl7.org/cda/us/ccda/Binary-care-team-type-example.html",
    text: "care-team-type-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.500.3.html",
    href: "https://hl7.org/cda/us/ccda/Binary-care-team-member-schedule-observation-example.html",
    text: "care-team-member-schedule-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.500.html",
    href: "https://hl7.org/cda/us/ccda/Binary-care-team-organizer-example.html",
    text: "care-team-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.501.html",
    href: "https://hl7.org/cda/us/ccda/Binary-sexual-orientation-observation-example.html",
    text: "sexual-orientation-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.501.html",
    href: "https://hl7.org/cda/us/ccda/Binary-sexual-orientation-observation-nullflavor-example.html",
    text: "sexual-orientation-observation-nullflavor-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.502.html",
    href: "https://hl7.org/cda/us/ccda/Binary-date-of-diagnosis-act-example.html",
    text: "date-of-diagnosis-act-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.503.html",
    href: "https://hl7.org/cda/us/ccda/Binary-basic-occupation-observation-example.html",
    text: "basic-occupation-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.504.html",
    href: "https://hl7.org/cda/us/ccda/Binary-basic-industry-observation-example.html",
    text: "basic-industry-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.505.html",
    href: "https://hl7.org/cda/us/ccda/Binary-disability-status-observation-example.html",
    text: "disability-status-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.506.html",
    href: "https://hl7.org/cda/us/ccda/Binary-tribal-affiliation-example.html",
    text: "tribal-affiliation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.507.html",
    href: "https://hl7.org/cda/us/ccda/Binary-sex-observation-example.html",
    text: "sex-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.507.html",
    href: "https://hl7.org/cda/us/ccda/Binary-sex-observation-nullflavor-example.html",
    text: "sex-observation-nullflavor-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.508.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medication-adherence-example.html",
    text: "medication-adherence-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.508.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medication-adherence-nullflavor-example.html",
    text: "medication-adherence-nullflavor-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.51.html",
    href: "https://hl7.org/cda/us/ccda/Binary-postprocedure-diagnosis-example.html",
    text: "postprocedure-diagnosis-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.51.html",
    href: "https://hl7.org/cda/us/ccda/Binary-postprocedure-diagnosis-section-example.html",
    text: "postprocedure-diagnosis-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.511.html",
    href: "https://hl7.org/cda/us/ccda/Binary-smoking-status-coded-example.html",
    text: "smoking-status-coded-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.511.html",
    href: "https://hl7.org/cda/us/ccda/Binary-smoking-status-quantity-example.html",
    text: "smoking-status-quantity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.511.html",
    href: "https://hl7.org/cda/us/ccda/Binary-social-history-section-example.html",
    text: "social-history-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.512.html",
    href: "https://hl7.org/cda/us/ccda/Binary-average-bp-example.html",
    text: "average-bp-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.512.html",
    href: "https://hl7.org/cda/us/ccda/Binary-vital-signs-section-example.html",
    text: "vital-signs-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.513.html",
    href: "https://hl7.org/cda/us/ccda/Binary-advance-directive-existence-observation-example.html",
    text: "advance-directive-existence-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.513.html",
    href: "https://hl7.org/cda/us/ccda/Binary-advance-directives-section-example.html",
    text: "advance-directives-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.515.html",
    href: "https://hl7.org/cda/us/ccda/Binary-instruction-example.html",
    text: "instruction-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.515.html",
    href: "https://hl7.org/cda/us/ccda/Binary-medication-supply-order-example.html",
    text: "medication-supply-order-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.52.html",
    href: "https://hl7.org/cda/us/ccda/Binary-immunization-activity-example.html",
    text: "immunization-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.52.html",
    href: "https://hl7.org/cda/us/ccda/Binary-immunizations-section-example.html",
    text: "immunizations-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.53.html",
    href: "https://hl7.org/cda/us/ccda/Binary-immunization-notgiven-reason-example.html",
    text: "immunization-notgiven-reason-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.54.html",
    href: "https://hl7.org/cda/us/ccda/Binary-immunization-activity-example.html",
    text: "immunization-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.54.html",
    href: "https://hl7.org/cda/us/ccda/Binary-immunization-medication-information-example.html",
    text: "immunization-medication-information-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.54.html",
    href: "https://hl7.org/cda/us/ccda/Binary-immunizations-section-example.html",
    text: "immunizations-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.54.html",
    href: "https://hl7.org/cda/us/ccda/Binary-planned-immunization-activity.html",
    text: "planned-immunization-activity",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.60.html",
    href: "https://hl7.org/cda/us/ccda/Binary-coverage-activity-example.html",
    text: "coverage-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.60.html",
    href: "https://hl7.org/cda/us/ccda/Binary-payers-section-example.html",
    text: "payers-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.61.html",
    href: "https://hl7.org/cda/us/ccda/Binary-coverage-activity-example.html",
    text: "coverage-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.61.html",
    href: "https://hl7.org/cda/us/ccda/Binary-payers-section-example.html",
    text: "payers-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.61.html",
    href: "https://hl7.org/cda/us/ccda/Binary-policy-activity-example.html",
    text: "policy-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.64.html",
    href: "https://hl7.org/cda/us/ccda/Binary-comment-activity-example.html",
    text: "comment-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.65.html",
    href: "https://hl7.org/cda/us/ccda/Binary-preoperative-diagnosis-example.html",
    text: "preoperative-diagnosis-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.65.html",
    href: "https://hl7.org/cda/us/ccda/Binary-preoperative-diagnosis-section-example.html",
    text: "preoperative-diagnosis-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.66.html",
    href: "https://hl7.org/cda/us/ccda/Binary-functional-status-organizer-example.html",
    text: "functional-status-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.66.html",
    href: "https://hl7.org/cda/us/ccda/Binary-functional-status-section-example.html",
    text: "functional-status-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.67.html",
    href: "https://hl7.org/cda/us/ccda/Binary-functional-status-observation-example.html",
    text: "functional-status-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.67.html",
    href: "https://hl7.org/cda/us/ccda/Binary-functional-status-organizer-example.html",
    text: "functional-status-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.67.html",
    href: "https://hl7.org/cda/us/ccda/Binary-functional-status-section-example.html",
    text: "functional-status-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.68.99999.html",
    href: "https://hl7.org/cda/us/ccda/Binary-section-time-range-example.html",
    text: "section-time-range-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.69.html",
    href: "https://hl7.org/cda/us/ccda/Binary-assessment-scale-observation-example.html",
    text: "assessment-scale-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.69.html",
    href: "https://hl7.org/cda/us/ccda/Binary-disability-status-observation-example.html",
    text: "disability-status-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.69.html",
    href: "https://hl7.org/cda/us/ccda/Binary-sensory-and-speech-status-example.html",
    text: "sensory-and-speech-status-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.7.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergies-and-intolerances-section-example.html",
    text: "allergies-and-intolerances-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.7.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-concern-act-example.html",
    text: "allergy-concern-act-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.7.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-intolerance-observation-drugclass-example.html",
    text: "allergy-intolerance-observation-drugclass-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.7.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-intolerance-observation-medication-example.html",
    text: "allergy-intolerance-observation-medication-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.7.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-intolerance-observation-nonmedication-example.html",
    text: "allergy-intolerance-observation-nonmedication-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.7.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-to-food-egg.html",
    text: "allergy-to-food-egg",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.72.html",
    href: "https://hl7.org/cda/us/ccda/Binary-caregiver-characteristics-example.html",
    text: "caregiver-characteristics-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.72.html",
    href: "https://hl7.org/cda/us/ccda/Binary-functional-status-section-example.html",
    text: "functional-status-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.72.html",
    href: "https://hl7.org/cda/us/ccda/Binary-social-history-section-example.html",
    text: "social-history-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.74.html",
    href: "https://hl7.org/cda/us/ccda/Binary-mental-status-observation-example.html",
    text: "mental-status-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.74.html",
    href: "https://hl7.org/cda/us/ccda/Binary-mental-status-organizer-example.html",
    text: "mental-status-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.74.html",
    href: "https://hl7.org/cda/us/ccda/Binary-mental-status-section-example.html",
    text: "mental-status-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.75.html",
    href: "https://hl7.org/cda/us/ccda/Binary-mental-status-organizer-example.html",
    text: "mental-status-organizer-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.75.html",
    href: "https://hl7.org/cda/us/ccda/Binary-mental-status-section-example.html",
    text: "mental-status-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.76.html",
    href: "https://hl7.org/cda/us/ccda/Binary-number-of-pressure-ulcers-observation-example.html",
    text: "number-of-pressure-ulcers-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.77.html",
    href: "https://hl7.org/cda/us/ccda/Binary-highest-pressure-ulcer-stage-example.html",
    text: "highest-pressure-ulcer-stage-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.78.html",
    href: "https://hl7.org/cda/us/ccda/Binary-smoking-status-meaningful-use-example.html",
    text: "smoking-status-meaningful-use-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.79.html",
    href: "https://hl7.org/cda/us/ccda/Binary-deceased-observation-example.html",
    text: "deceased-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.8.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-intolerance-observation-drugclass-example.html",
    text: "allergy-intolerance-observation-drugclass-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.8.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-intolerance-observation-medication-example.html",
    text: "allergy-intolerance-observation-medication-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.8.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-intolerance-observation-nonmedication-example.html",
    text: "allergy-intolerance-observation-nonmedication-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.8.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-to-food-egg.html",
    text: "allergy-to-food-egg",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.8.html",
    href: "https://hl7.org/cda/us/ccda/Binary-reaction-observation-example.html",
    text: "reaction-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.8.html",
    href: "https://hl7.org/cda/us/ccda/Binary-severity-observation-example.html",
    text: "severity-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.80.html",
    href: "https://hl7.org/cda/us/ccda/Binary-encounter-diagnosis-example.html",
    text: "encounter-diagnosis-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.85.html",
    href: "https://hl7.org/cda/us/ccda/Binary-health-concern-act-example.html",
    text: "health-concern-act-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.85.html",
    href: "https://hl7.org/cda/us/ccda/Binary-health-concerns-section-example.html",
    text: "health-concerns-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.85.html",
    href: "https://hl7.org/cda/us/ccda/Binary-tobacco-use-example.html",
    text: "tobacco-use-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.86.html",
    href: "https://hl7.org/cda/us/ccda/Binary-assessment-scale-observation-example.html",
    text: "assessment-scale-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.86.html",
    href: "https://hl7.org/cda/us/ccda/Binary-assessment-scale-supporting-observation-example.html",
    text: "assessment-scale-supporting-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.86.html",
    href: "https://hl7.org/cda/us/ccda/Binary-disability-status-observation-example.html",
    text: "disability-status-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.86.html",
    href: "https://hl7.org/cda/us/ccda/Binary-sensory-and-speech-status-example.html",
    text: "sensory-and-speech-status-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.87.html",
    href: "https://hl7.org/cda/us/ccda/Binary-coverage-activity-example.html",
    text: "coverage-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.87.html",
    href: "https://hl7.org/cda/us/ccda/Binary-payers-section-example.html",
    text: "payers-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.87.html",
    href: "https://hl7.org/cda/us/ccda/Binary-policy-activity-example.html",
    text: "policy-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.88.html",
    href: "https://hl7.org/cda/us/ccda/Binary-policy-activity-example.html",
    text: "policy-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.89.html",
    href: "https://hl7.org/cda/us/ccda/Binary-coverage-activity-example.html",
    text: "coverage-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.89.html",
    href: "https://hl7.org/cda/us/ccda/Binary-payers-section-example.html",
    text: "payers-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.89.html",
    href: "https://hl7.org/cda/us/ccda/Binary-policy-activity-example.html",
    text: "policy-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.9.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-intolerance-observation-drugclass-example.html",
    text: "allergy-intolerance-observation-drugclass-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.9.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-intolerance-observation-medication-example.html",
    text: "allergy-intolerance-observation-medication-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.9.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-intolerance-observation-nonmedication-example.html",
    text: "allergy-intolerance-observation-nonmedication-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.9.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-to-food-egg.html",
    text: "allergy-to-food-egg",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.9.html",
    href: "https://hl7.org/cda/us/ccda/Binary-reaction-observation-example.html",
    text: "reaction-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.4.90.html",
    href: "https://hl7.org/cda/us/ccda/Binary-policy-activity-example.html",
    text: "policy-activity-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.5.6.html",
    href: "https://hl7.org/cda/us/ccda/Binary-advance-directive-existence-observation-example.html",
    text: "advance-directive-existence-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.5.6.html",
    href: "https://hl7.org/cda/us/ccda/Binary-advance-directives-section-example.html",
    text: "advance-directives-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.5.6.html",
    href: "https://hl7.org/cda/us/ccda/Binary-ccd-header-example.html",
    text: "ccd-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.5.6.html",
    href: "https://hl7.org/cda/us/ccda/Binary-provenance-author-participation-example.html",
    text: "provenance-author-participation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.5.7.html",
    href: "https://hl7.org/cda/us/ccda/Binary-provenance-assembler-participation-example.html",
    text: "provenance-assembler-participation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.5.8.html",
    href: "https://hl7.org/cda/us/ccda/Binary-ccd-header-example.html",
    text: "ccd-header-example",
  },
  {
    file: "2.16.840.1.113883.10.20.22.5.8.html",
    href: "https://hl7.org/cda/us/ccda/Binary-related-person-relationship-and-name-example.html",
    text: "related-person-relationship-and-name-example",
  },
  {
    file: "2.16.840.1.113883.10.20.24.3.88.html",
    href: "https://hl7.org/cda/us/ccda/Binary-reason-example.html",
    text: "reason-example",
  },
  {
    file: "2.16.840.1.113883.10.20.24.3.90.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergies-and-intolerances-section-example.html",
    text: "allergies-and-intolerances-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.24.3.90.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-concern-act-example.html",
    text: "allergy-concern-act-example",
  },
  {
    file: "2.16.840.1.113883.10.20.24.3.90.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-intolerance-observation-drugclass-example.html",
    text: "allergy-intolerance-observation-drugclass-example",
  },
  {
    file: "2.16.840.1.113883.10.20.24.3.90.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-intolerance-observation-medication-example.html",
    text: "allergy-intolerance-observation-medication-example",
  },
  {
    file: "2.16.840.1.113883.10.20.24.3.90.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-intolerance-observation-nonmedication-example.html",
    text: "allergy-intolerance-observation-nonmedication-example",
  },
  {
    file: "2.16.840.1.113883.10.20.24.3.90.html",
    href: "https://hl7.org/cda/us/ccda/Binary-allergy-to-food-egg.html",
    text: "allergy-to-food-egg",
  },
  {
    file: "2.16.840.1.113883.10.20.29.1.html",
    href: "https://hl7.org/cda/us/ccda/Binary-patient-generated-document-informationrecipient.html",
    text: "patient-generated-document-informationrecipient",
  },
  {
    file: "2.16.840.1.113883.10.20.34.3.45.html",
    href: "https://hl7.org/cda/us/ccda/Binary-gender-identity-observation-example.html",
    text: "gender-identity-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.34.3.45.html",
    href: "https://hl7.org/cda/us/ccda/Binary-gender-identity-observation-nullflavor-example.html",
    text: "gender-identity-observation-nullflavor-example",
  },
  {
    file: "2.16.840.1.113883.10.20.6.2.13.html",
    href: "https://hl7.org/cda/us/ccda/Binary-code-observation-example.html",
    text: "code-observation-example",
  },
  {
    file: "2.16.840.1.113883.10.20.7.12.html",
    href: "https://hl7.org/cda/us/ccda/Binary-operative-note-fluids-section-example.html",
    text: "operative-note-fluids-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.7.13.html",
    href: "https://hl7.org/cda/us/ccda/Binary-surgical-drains-section-example.html",
    text: "surgical-drains-section-example",
  },
  {
    file: "2.16.840.1.113883.10.20.7.14.html",
    href: "https://hl7.org/cda/us/ccda/Binary-operative-note-surgical-procedure-section-example.html",
    text: "operative-note-surgical-procedure-section-example",
  },
];

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const res = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(res);
    } else {
      yield res;
    }
  }
}

function ensureGuideExamplesUL($) {
  // Find existing UL by id
  let $ul = $('[id="guide_examples"]').filter("ul").first();

  // If no UL#guide_examples, try any tag with id and convert or create a proper UL nearby
  if ($ul.length === 0) {
    const $existing = $('[id="guide_examples"]').first();
    if ($existing.length > 0 && $existing[0].tagName !== "ul") {
      // Replace the node with a UL preserving id
      const attrs = $existing.attr();
      $ul = $("<ul></ul>").attr(attrs);
      $existing.replaceWith($ul);
    } else {
      // Create a brand-new UL and append before </body> (or to root if no body)
      $ul = $('<ul id="guide_examples"></ul>');
      const $body = $("body");
      if ($body.length) {
        $body.append("\n");
        $body.append($ul);
        $body.append("\n");
      } else {
        $.root().append("\n");
        $.root().append($ul);
        $.root().append("\n");
      }
    }
  }

  return $ul;
}

function addAnchorsToUL($, items, mode = "append") {
  const $ul = ensureGuideExamplesUL($);

  if (mode === "replace") {
    $ul.empty();
  }

  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    const { href, text, ...rest } = item;

    if (!href || !text) continue; // require minimal fields

    // Build <a ...>text</a>
    const $a = $("<a></a>").attr("href", href).text(text);

    // Apply any extra attributes (e.g., target, rel, class, id, data-*)
    for (const [k, v] of Object.entries(rest)) {
      if (v == null) continue;
      $a.attr(k, String(v));
    }

    // Wrap in <li> for valid UL structure
    const $li = $("<li></li>").append($a);
    $ul.append("\n  ");
    $ul.append($li);
  }

  // nice trailing newline if we added any
  if (items.length > 0) $ul.append("\n");
}

function processHtml(html, items, mode) {
  const $ = cheerio.load(html, { decodeEntities: false });

  const before = $.html();
  addAnchorsToUL($, items, mode);
  const after = $.html();

  const modified = before !== after;
  return { modified, output: after };
}

async function processFile(filePath, mode) {
  const ext = path.extname(filePath).toLowerCase();
  if (!HTML_EXTENSIONS.has(ext)) return { skipped: true };

  const base = path.basename(filePath); // filename only

  let items = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].file === base) {
      items.push(data[i]);
    }
  }
  if (items.length === 0) return { modified: false }; // nothing to do

  const original = await fs.readFile(filePath, "utf8");
  const { modified, output } = processHtml(original, items, mode);
  if (!modified) return { modified: false };

  // Backup once if missing
  const backupPath = `${filePath}.bak`;
  try {
    await fs.access(backupPath);
  } catch {
    await fs.writeFile(backupPath, original, "utf8");
  }

  await fs.writeFile(filePath, output, "utf8");
  return { modified: true };
}

async function main() {
  const targetDir = process.argv[2];
  const modeFlag = (
    process.argv.find((a) => a.startsWith("--mode=")) || "--mode=append"
  ).split("=")[1];
  const mode = modeFlag === "replace" ? "replace" : "append";

  if (!targetDir) {
    console.error(
      "Usage: node insert-guide-examples.js /path/to/html/folder [--mode=append|replace]",
    );
    process.exit(1);
  }

  const absDir = path.resolve(targetDir);
  let scanned = 0;
  let modified = 0;

  for await (const file of walk(absDir)) {
    const ext = path.extname(file).toLowerCase();
    if (!HTML_EXTENSIONS.has(ext)) continue;
    scanned += 1;
    try {
      const result = await processFile(file, mode);
      if (result.modified) {
        modified += 1;
        console.log(`✔ Modified: ${file}`);
      }
    } catch (err) {
      console.error(`✖ Error processing ${file}:`, err.message);
    }
  }

  console.log("\nDone.");
  console.log(`Scanned HTML files: ${scanned}`);
  console.log(`Files modified:     ${modified}`);
  console.log(`Mode:               ${mode}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
