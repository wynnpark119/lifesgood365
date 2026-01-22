"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { PageHeader } from "@/components/shared/PageHeader";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

export default function LogsPage() {
    const { logs } = useStore();
    const [actionFilter, setActionFilter] = useState("all");
    const [entityFilter, setEntityFilter] = useState("all");

    const actions = useMemo(() => {
        return Array.from(new Set(logs.map((l) => l.action)));
    }, [logs]);

    const entities = useMemo(() => {
        return Array.from(new Set(logs.map((l) => l.entity)));
    }, [logs]);

    const filteredLogs = useMemo(() => {
        return logs.filter((log) => {
            const matchesAction = actionFilter === "all" || log.action === actionFilter;
            const matchesEntity = entityFilter === "all" || log.entity === entityFilter;
            return matchesAction && matchesEntity;
        });
    }, [logs, actionFilter, entityFilter]);

    return (
        <div className="flex flex-col">
            <PageHeader
                title="System Log"
                description="Track all actions and system events"
            />

            <div className="space-y-6 p-8">
                {/* Filters */}
                <div className="flex gap-4">
                    <Select value={actionFilter} onValueChange={setActionFilter}>
                        <SelectTrigger className="w-64">
                            <SelectValue placeholder="Filter by action" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Actions</SelectItem>
                            {actions.map((action) => (
                                <SelectItem key={action} value={action}>
                                    {action}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={entityFilter} onValueChange={setEntityFilter}>
                        <SelectTrigger className="w-64">
                            <SelectValue placeholder="Filter by entity" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Entities</SelectItem>
                            {entities.map((entity) => (
                                <SelectItem key={entity} value={entity}>
                                    {entity}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-48">Timestamp</TableHead>
                                <TableHead className="w-24">Actor</TableHead>
                                <TableHead className="w-48">Action</TableHead>
                                <TableHead className="w-32">Entity</TableHead>
                                <TableHead>Detail</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        No logs recorded yet
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredLogs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="text-xs">
                                            {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
                                        </TableCell>
                                        <TableCell>
                                            <span
                                                className={`text-xs ${log.actor === "user" ? "text-blue-600" : "text-gray-600"
                                                    }`}
                                            >
                                                {log.actor}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-medium">{log.action}</TableCell>
                                        <TableCell>{log.entity}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {log.detail}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
