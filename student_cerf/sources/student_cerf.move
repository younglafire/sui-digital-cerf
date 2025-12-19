/// Module: student_cerf
/// 
/// This module implements a school-issued digital certificate system on Sui.
/// Only the school (holding IssuerCap) can mint certificates.
/// Each student can receive exactly one certificate, preventing duplicates.
module student_cerf::student_cerf;

use std::string::String;
use sui::table::Table;

/// Error codes
const EAlreadyHasCertificate: u64 = 1;

/// Certificate object - represents a digital certificate issued to a student
public struct Certificate has key, store {
    id: sui::object::UID,
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
    id: sui::object::UID,
    school_name: String,
}

/// Registry - tracks all issued certificates to prevent duplicates
public struct Registry has key {
    id: sui::object::UID,
    /// Maps student address to their certificate ID
    issued_certificates: Table<address, u64>,
    /// Counter for certificate IDs
    next_certificate_id: u64,
}

/// Module initializer - creates IssuerCap and Registry
/// The IssuerCap is transferred to the deployer (school)
/// Note: This uses a default school name. To customize, modify the school_name
/// field before deployment or use the create_issuer_cap function after deployment
fun init(ctx: &mut sui::tx_context::TxContext) {
    // Create and transfer IssuerCap to the deployer (school)
    // Default school name can be changed by modifying this value before deployment
    let issuer_cap = IssuerCap {
        id: sui::object::new(ctx),
        school_name: std::string::utf8(b"Digital Certification School"),
    };
    sui::transfer::transfer(issuer_cap, sui::tx_context::sender(ctx));

    // Create Registry as a shared object
    let registry = Registry {
        id: sui::object::new(ctx),
        issued_certificates: sui::table::new(ctx),
        next_certificate_id: 1,
    };
    sui::transfer::share_object(registry);
}

/// Create a new IssuerCap with a custom school name
/// This can be called by the original IssuerCap holder to create additional
/// issuer capabilities for the same or different schools
public entry fun create_issuer_cap(
    _existing_cap: &IssuerCap,
    school_name: vector<u8>,
    recipient: address,
    ctx: &mut sui::tx_context::TxContext
) {
    let new_cap = IssuerCap {
        id: sui::object::new(ctx),
        school_name: std::string::utf8(school_name),
    };
    sui::transfer::transfer(new_cap, recipient);
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
    ctx: &mut sui::tx_context::TxContext
) {
    // Check if student already has a certificate
    assert!(!sui::table::contains(&registry.issued_certificates, student), EAlreadyHasCertificate);

    // Get the certificate ID
    let certificate_id = registry.next_certificate_id;
    
    // Create the certificate, using school name from IssuerCap
    let certificate = Certificate {
        id: sui::object::new(ctx),
        student,
        school_name: _cap.school_name,
        student_name: std::string::utf8(student_name),
        course: std::string::utf8(course),
        issue_date,
        certificate_id,
    };

    // Record the certificate in the registry
    sui::table::add(&mut registry.issued_certificates, student, certificate_id);
    registry.next_certificate_id = certificate_id + 1;

    // Transfer certificate to student
    sui::transfer::transfer(certificate, student);
}

/// Check if a student has a certificate
public fun has_certificate(registry: &Registry, student: address): bool {
    sui::table::contains(&registry.issued_certificates, student)
}

/// Get certificate ID for a student (if they have one)
/// Returns the certificate ID, or aborts if student doesn't have a certificate
/// Use has_certificate() first to check if student has a certificate
public fun get_certificate_id(registry: &Registry, student: address): u64 {
    assert!(sui::table::contains(&registry.issued_certificates, student), EAlreadyHasCertificate);
    *sui::table::borrow(&registry.issued_certificates, student)
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
public fun test_init(ctx: &mut sui::tx_context::TxContext) {
    init(ctx);
}
