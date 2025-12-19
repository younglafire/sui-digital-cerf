module student_cert::cert {
    use std::string;
    use sui::event;

    // ========== Structs ==========
    
    /// The main Certification object (Soul-Bound Token)
    /// Simplified to only store name and course
    public struct Certification has key {
        id: UID,
        student_name: string::String,
        course: string::String,
    }

    // ========== Events ==========
    
    /// Event emitted when a certificate is issued
    public struct CertificateIssued has copy, drop {
        student_name: string::String,
        course: string::String,
        student_address: address,
    }

    // ========== Functions ==========

    /// Issue a certificate to yourself
    /// Anyone can call this function to create their own certificate
    public entry fun issue_certificate(
        student_name: vector<u8>,
        course: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        let cert = Certification {
            id: object::new(ctx),
            student_name: string::utf8(student_name),
            course: string::utf8(course),
        };

        // Emit event
        event::emit(CertificateIssued {
            student_name: cert.student_name,
            course: cert.course,
            student_address: sender,
        });

        // Transfer to sender (the student)
        transfer::transfer(cert, sender);
    }

    // ========== View Functions ==========

    public fun get_student_name(cert: &Certification): string::String {
        cert.student_name
    }

    public fun get_course(cert: &Certification): string::String {
        cert.course
    }
}