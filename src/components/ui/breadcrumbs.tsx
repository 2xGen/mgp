"use client";

import React, { Fragment } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb" className={cn("text-sm text-muted-foreground", className)}>
            <ol className="flex items-center gap-1.5">
                {items.map((item, index) => (
                    <Fragment key={index}>
                        <li>
                            {item.href ? (
                                <Link href={item.href} className="hover:text-primary transition-colors">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="font-medium text-foreground">{item.label}</span>
                            )}
                        </li>
                        {index < items.length - 1 && (
                             <li>
                                <ChevronRight className="h-4 w-4" />
                            </li>
                        )}
                    </Fragment>
                ))}
            </ol>
        </nav>
    );
}