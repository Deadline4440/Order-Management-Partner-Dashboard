"use client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ledger } from "@/lib/data"
import { Badge } from "@/components/ui/badge"

export function LedgerTable() {
    return (
        <div className="border shadow-sm rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">Date</TableHead>
                        <TableHead className="w-[120px]">Type</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead className="text-right">Debit</TableHead>
                        <TableHead className="text-right">Credit</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ledger.map((entry, index) => (
                        <TableRow key={index}>
                            <TableCell>{entry.date}</TableCell>
                            <TableCell>
                                <Badge variant={entry.type === 'Invoice' ? 'destructive' : 'default'} className={entry.type === 'Payment' ? 'bg-green-600/80' : 'bg-red-500/80'}>
                                    {entry.type}
                                </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{entry.ref}</TableCell>
                            <TableCell className="text-right text-red-600">
                                {entry.debit > 0 ? `₹${entry.debit.toFixed(2)}` : '-'}
                            </TableCell>
                            <TableCell className="text-right text-green-600">
                                {entry.credit > 0 ? `₹${entry.credit.toFixed(2)}` : '-'}
                            </TableCell>
                            <TableCell className="text-right font-semibold">₹{entry.balance.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
