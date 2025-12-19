#[test_only]
module student_cerf::student_cerf_tests;

use student_cerf::student_cerf::{Self, IssuerCap, Registry, Certificate};
use sui::test_scenario::{Self as ts, Scenario};
use sui::object;
use std::string;

/// Error codes (same as in main module)
const EAlreadyHasCertificate: u64 = 1;

/// Test addresses
const SCHOOL: address = @0xA;
const STUDENT1: address = @0xB;
const STUDENT2: address = @0xC;
const UNAUTHORIZED: address = @0xD;

/// Helper function to setup test scenario
fun setup_test(): Scenario {
    let mut scenario = ts::begin(SCHOOL);
    {
        student_cerf::test_init(ts::ctx(&mut scenario));
    };
    scenario
}

#[test]
/// Test successful certificate minting
fun test_mint_certificate_success() {
    let mut scenario = setup_test();
    
    // School receives IssuerCap
    ts::next_tx(&mut scenario, SCHOOL);
    {
        let cap = ts::take_from_sender<IssuerCap>(&scenario);
        let mut registry = ts::take_shared<Registry>(&scenario);
        
        // Mint certificate for STUDENT1
        student_cerf::mint_certificate(
            &cap,
            &mut registry,
            STUDENT1,
            b"Alice Smith",
            b"Computer Science",
            1734573600, // timestamp
            ts::ctx(&mut scenario)
        );
        
        // Verify certificate was recorded in registry
        assert!(student_cerf::has_certificate(&registry, STUDENT1), 0);
        assert!(student_cerf::get_certificate_id(&registry, STUDENT1) == 1, 1);
        assert!(student_cerf::get_total_certificates(&registry) == 1, 2);
        
        ts::return_to_sender(&scenario, cap);
        ts::return_shared(registry);
    };
    
    // Student receives certificate
    ts::next_tx(&mut scenario, STUDENT1);
    {
        let cert = ts::take_from_sender<Certificate>(&scenario);
        
        // Verify certificate details
        assert!(student_cerf::certificate_student(&cert) == STUDENT1, 3);
        assert!(student_cerf::certificate_student_name(&cert) == string::utf8(b"Alice Smith"), 4);
        assert!(student_cerf::certificate_course(&cert) == string::utf8(b"Computer Science"), 5);
        assert!(student_cerf::certificate_issue_date(&cert) == 1734573600, 6);
        assert!(student_cerf::certificate_id(&cert) == 1, 7);
        
        ts::return_to_sender(&scenario, cert);
    };
    
    ts::end(scenario);
}

#[test]
/// Test minting certificates for multiple students
fun test_mint_multiple_certificates() {
    let mut scenario = setup_test();
    
    ts::next_tx(&mut scenario, SCHOOL);
    {
        let cap = ts::take_from_sender<IssuerCap>(&scenario);
        let mut registry = ts::take_shared<Registry>(&scenario);
        
        // Mint for STUDENT1
        student_cerf::mint_certificate(
            &cap,
            &mut registry,
            STUDENT1,
            b"Alice Smith",
            b"Computer Science",
            1734573600,
            ts::ctx(&mut scenario)
        );
        
        // Mint for STUDENT2
        student_cerf::mint_certificate(
            &cap,
            &mut registry,
            STUDENT2,
            b"Bob Johnson",
            b"Mathematics",
            1734573601,
            ts::ctx(&mut scenario)
        );
        
        // Verify both certificates are recorded
        assert!(student_cerf::has_certificate(&registry, STUDENT1), 0);
        assert!(student_cerf::has_certificate(&registry, STUDENT2), 1);
        assert!(student_cerf::get_certificate_id(&registry, STUDENT1) == 1, 2);
        assert!(student_cerf::get_certificate_id(&registry, STUDENT2) == 2, 3);
        assert!(student_cerf::get_total_certificates(&registry) == 2, 4);
        
        ts::return_to_sender(&scenario, cap);
        ts::return_shared(registry);
    };
    
    ts::end(scenario);
}

#[test]
#[expected_failure(abort_code = EAlreadyHasCertificate)]
/// Test that duplicate certificates are prevented
fun test_duplicate_certificate_fails() {
    let mut scenario = setup_test();
    
    ts::next_tx(&mut scenario, SCHOOL);
    {
        let cap = ts::take_from_sender<IssuerCap>(&scenario);
        let mut registry = ts::take_shared<Registry>(&scenario);
        
        // Mint first certificate for STUDENT1
        student_cerf::mint_certificate(
            &cap,
            &mut registry,
            STUDENT1,
            b"Alice Smith",
            b"Computer Science",
            1734573600,
            ts::ctx(&mut scenario)
        );
        
        // Try to mint second certificate for STUDENT1 - should fail
        student_cerf::mint_certificate(
            &cap,
            &mut registry,
            STUDENT1,
            b"Alice Smith",
            b"Mathematics",
            1734573601,
            ts::ctx(&mut scenario)
        );
        
        ts::return_to_sender(&scenario, cap);
        ts::return_shared(registry);
    };
    
    ts::end(scenario);
}

#[test]
/// Test checking if student has certificate
fun test_has_certificate() {
    let mut scenario = setup_test();
    
    ts::next_tx(&mut scenario, SCHOOL);
    {
        let cap = ts::take_from_sender<IssuerCap>(&scenario);
        let mut registry = ts::take_shared<Registry>(&scenario);
        
        // Initially no certificate
        assert!(!student_cerf::has_certificate(&registry, STUDENT1), 0);
        
        // Mint certificate
        student_cerf::mint_certificate(
            &cap,
            &mut registry,
            STUDENT1,
            b"Alice Smith",
            b"Computer Science",
            1734573600,
            ts::ctx(&mut scenario)
        );
        
        // Now has certificate
        assert!(student_cerf::has_certificate(&registry, STUDENT1), 1);
        // STUDENT2 still doesn't have one
        assert!(!student_cerf::has_certificate(&registry, STUDENT2), 2);
        
        ts::return_to_sender(&scenario, cap);
        ts::return_shared(registry);
    };
    
    ts::end(scenario);
}

#[test]
/// Test certificate ID increments correctly
fun test_certificate_id_increment() {
    let mut scenario = setup_test();
    
    ts::next_tx(&mut scenario, SCHOOL);
    {
        let cap = ts::take_from_sender<IssuerCap>(&scenario);
        let mut registry = ts::take_shared<Registry>(&scenario);
        
        // Initial state
        assert!(student_cerf::get_total_certificates(&registry) == 0, 0);
        
        // Mint first certificate
        student_cerf::mint_certificate(
            &cap,
            &mut registry,
            STUDENT1,
            b"Alice Smith",
            b"Computer Science",
            1734573600,
            ts::ctx(&mut scenario)
        );
        assert!(student_cerf::get_total_certificates(&registry) == 1, 1);
        
        // Mint second certificate
        student_cerf::mint_certificate(
            &cap,
            &mut registry,
            STUDENT2,
            b"Bob Johnson",
            b"Mathematics",
            1734573601,
            ts::ctx(&mut scenario)
        );
        assert!(student_cerf::get_total_certificates(&registry) == 2, 2);
        
        ts::return_to_sender(&scenario, cap);
        ts::return_shared(registry);
    };
    
    ts::end(scenario);
}
