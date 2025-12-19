/// Module: student_cerf
/// 
/// This module implements a school-issued digital certificate system on Sui.
/// Only the school (holding IssuerCap) can mint certificates.
/// Each student can receive exactly one certificate, preventing duplicates.
module student_cerf::student_cerf;

use sui::object::{Self, UID};
use sui::tx_context::{Self, TxContext};
use sui::transfer;
use std::string::{Self, String};
use sui::table::{Self, Table};

/// Error codes
const EAlreadyHasCertificate: u64 = 1;
const ENotAuthorized: u64 = 2;

/// Certificate object - represents a digital certificate issued to a student
public struct Certificate has key, store {
    id: UID,
    student: address,
    school_name: String,
    student_name: String,
    course: String,
    issue_date: u64,
    certificate_id: u64,
}

/// IssuerCap - capability object that authorizes certificate issuance
/// Only the school (owner of this object) can mint certificates
public struct IssuerCap has key, store {
    id: UID,
    school_name: String,
}

/// Registry - tracks all issued certificates to prevent duplicates
public struct Registry has key {
    id: UID,
    /// Maps student address to their certificate ID
    issued_certificates: Table<address, u64>,
    /// Counter for certificate IDs
    next_certificate_id: u64,
}

/// Module initializer - creates IssuerCap and Registry
/// The IssuerCap is transferred to the deployer (school)
fun init(ctx: &mut TxContext) {
    // Create and transfer IssuerCap to the deployer (school)
    let issuer_cap = IssuerCap {
        id: object::new(ctx),
        school_name: string::utf8(b"Digital Certification School"),
    };
    transfer::transfer(issuer_cap, tx_context::sender(ctx));

    // Create Registry as a shared object
    let registry = Registry {
        id: object::new(ctx),
        issued_certificates: table::new(ctx),
        next_certificate_id: 1,
    };
    transfer::share_object(registry);
}

/// Mint a certificate for a student
/// Requirements:
/// - Caller must own IssuerCap (be the school)
/// - Student must not already have a certificate
/// - Certificate is transferred directly to the student
public entry fun mint_certificate(
    _cap: &IssuerCap,
    registry: &mut Registry,
    student: address,
    student_name: vector<u8>,
    course: vector<u8>,
    issue_date: u64,
    ctx: &mut TxContext
) {
    // Check if student already has a certificate
    assert!(!table::contains(&registry.issued_certificates, student), EAlreadyHasCertificate);

    // Get the certificate ID
    let certificate_id = registry.next_certificate_id;
    
    // Create the certificate
    let certificate = Certificate {
        id: object::new(ctx),
        student,
        school_name: string::utf8(b"Digital Certification School"),
        student_name: string::utf8(student_name),
        course: string::utf8(course),
        issue_date,
        certificate_id,
    };

    // Record the certificate in the registry
    table::add(&mut registry.issued_certificates, student, certificate_id);
    registry.next_certificate_id = certificate_id + 1;

    // Transfer certificate to student
    transfer::transfer(certificate, student);
}

/// Check if a student has a certificate
public fun has_certificate(registry: &Registry, student: address): bool {
    table::contains(&registry.issued_certificates, student)
}

/// Get certificate ID for a student (if they have one)
public fun get_certificate_id(registry: &Registry, student: address): u64 {
    *table::borrow(&registry.issued_certificates, student)
}

/// Get total number of certificates issued
public fun get_total_certificates(registry: &Registry): u64 {
    registry.next_certificate_id - 1
}

// Accessor functions for Certificate fields
public fun certificate_student(cert: &Certificate): address {
    cert.student
}

public fun certificate_school_name(cert: &Certificate): String {
    cert.school_name
}

public fun certificate_student_name(cert: &Certificate): String {
    cert.student_name
}

public fun certificate_course(cert: &Certificate): String {
    cert.course
}

public fun certificate_issue_date(cert: &Certificate): u64 {
    cert.issue_date
}

public fun certificate_id(cert: &Certificate): u64 {
    cert.certificate_id
}

#[test_only]
/// Test-only function to create IssuerCap for testing
public fun test_init(ctx: &mut TxContext) {
    init(ctx);
}
