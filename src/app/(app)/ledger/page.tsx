import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { LedgerTable } from "@/components/ledger/ledger-table";

export default function LedgerPage() {
    return (
        <div>
            <PageHeader
                title="Financial Ledger"
                description="View your complete transaction history."
            >
                <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Ledger (PDF)
                </Button>
            </PageHeader>
            
            <LedgerTable />
        </div>
    );
}
