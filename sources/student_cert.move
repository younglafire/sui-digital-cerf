module student_cert::cert {
    use std::string;
    use sui::event;

    // ========== Error Codes ==========
    const ENotAuthorized: u64 = 1;

    // ========== Structs ==========
    
    /// The main Certification object (Soul-Bound Token)
    public struct Certification has key {
        id: UID,
        student_name: string::String,
        student_id: string::String,
        institution_name: string::String,
        degree_program: string::String,
        graduation_date: u64,
        issuer:  address,
        issue_date: u64,
        certificate_id: string::String,
    }

    /// Capability to issue certificates
    public struct IssuerCap has key {
        id: UID,
        institution_name: string::String,
    }

    // ========== Events ==========
    
    /// Event emitted when a certificate is issued
    public struct CertificateIssued has copy, drop {
        certificate_id: string::String,
        student_name: string::String,
        student_address: address,
        institution_name: string::String,
        issue_date: u64,
    }

    // ========== Functions ==========

    /// Initialize - creates issuer capability
    fun init(ctx: &mut TxContext) {
        let issuer_cap = IssuerCap {
            id: object::new(ctx),
            institution_name:  string::utf8(b"Demo University"),
        };
        transfer::transfer(issuer_cap, tx_context::sender(ctx));
    }

    /// Issue a certificate to a student
     entry fun issue_certificate(
        _issuer_cap: &IssuerCap,
        student_address: address,
        student_name: vector<u8>,
        student_id: vector<u8>,
        degree_program: vector<u8>,
        graduation_date: u64,
        certificate_id: vector<u8>,
        ctx: &mut TxContext
    ) {
        let cert = Certification {
            id:  object::new(ctx),
            student_name:  string::utf8(student_name),
            student_id: string:: utf8(student_id),
            institution_name: string::utf8(b"Demo University"),
            degree_program: string::utf8(degree_program),
            graduation_date,
            issuer: tx_context::sender(ctx),
            issue_date: tx_context::epoch(ctx),
            certificate_id: string::utf8(certificate_id),
        };

        // Emit event
        event::emit(CertificateIssued {
            certificate_id: cert. certificate_id,
            student_name: cert.student_name,
            student_address,
            institution_name: cert. institution_name,
            issue_date: cert.issue_date,
        });

        // Transfer to student
        transfer::transfer(cert, student_address);
    }

    // ========== View Functions ==========

    public fun get_student_name(cert: &Certification): string::String {
        cert.student_name
    }

    public fun get_institution(cert: &Certification): string::String {
        cert.institution_name
    }

    public fun get_degree_program(cert:  &Certification): string::String {
        cert.degree_program
    }

    public fun get_certificate_id(cert: &Certification): string::String {
        cert.certificate_id
    }

    public fun get_graduation_date(cert: &Certification): u64 {
        cert.graduation_date
    }
}