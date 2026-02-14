
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Briefcase, Edit, Globe, Loader2, Map as MapIcon, MapPin, Phone, Terminal } from "lucide-react";
import { updateLocation } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import type { LocationDetailsData } from "@/app/dashboard/dashboard-provider";

interface EditableCoreInfoProps {
    location: LocationDetailsData;
    onUpdateSuccess: (updatedData: Partial<LocationDetailsData>) => void;
}

const formSchema = z.object({
    title: z.string().min(1, "Business name is required."),
    websiteUri: z.string().url("Please enter a valid URL.").or(z.literal("")),
    primaryPhone: z.string().regex(/^(\+?[1-9]\d{1,14})?$/, "Please enter a valid phone number.").or(z.literal("")),
    addressLine1: z.string().optional(),
    locality: z.string().optional(),
    administrativeArea: z.string().optional(),
    postalCode: z.string().optional(),
    regionCode: z.string().optional(),
});

type CoreInfoFormValues = z.infer<typeof formSchema>;

export default function EditableCoreInfo({ location, onUpdateSuccess }: EditableCoreInfoProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const { name, title, storefrontAddress, websiteUri, phoneNumbers, categories, serviceArea } = location;

    const fullAddress = storefrontAddress
        ? [storefrontAddress.addressLines?.join(', '), storefrontAddress.locality, storefrontAddress.administrativeArea, storefrontAddress.postalCode, storefrontAddress.regionCode].filter(Boolean).join(', ')
        : 'No address provided';

    const form = useForm<CoreInfoFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: title || "",
            websiteUri: websiteUri || "",
            primaryPhone: phoneNumbers?.primaryPhone || "",
            addressLine1: storefrontAddress?.addressLines?.[0] || "",
            locality: storefrontAddress?.locality || "",
            administrativeArea: storefrontAddress?.administrativeArea || "",
            postalCode: storefrontAddress?.postalCode || "",
            regionCode: storefrontAddress?.regionCode || "",
        },
    });

    const onSubmit = async (values: CoreInfoFormValues) => {
        setIsSaving(true);
        setError(null);

        const updateData: any = {};
        const updateMask: string[] = [];

        if (values.title !== location.title) {
            updateData.title = values.title;
            updateMask.push('title');
        }
        if (values.websiteUri !== (location.websiteUri || "")) {
            updateData.websiteUri = values.websiteUri;
            updateMask.push('website_uri');
        }
        if (values.primaryPhone !== (location.phoneNumbers?.primaryPhone || "")) {
            updateData.phoneNumbers = { primaryPhone: values.primaryPhone };
            updateMask.push('phoneNumbers.primary_phone');
        }

        const newAddress = {
            addressLines: values.addressLine1 ? [values.addressLine1] : [],
            locality: values.locality,
            administrativeArea: values.administrativeArea,
            postalCode: values.postalCode,
            regionCode: values.regionCode,
        };
        
        // Simple check to see if the address has changed at all
        if (JSON.stringify(newAddress) !== JSON.stringify({
            addressLines: location.storefrontAddress?.addressLines || [],
            locality: location.storefrontAddress?.locality || "",
            administrativeArea: location.storefrontAddress?.administrativeArea || "",
            postalCode: location.storefrontAddress?.postalCode || "",
            regionCode: location.storefrontAddress?.regionCode || "",
        })) {
           updateData.storefrontAddress = newAddress;
           updateMask.push('storefront_address');
        }


        if (updateMask.length === 0) {
            setIsSaving(false);
            setIsDialogOpen(false);
            return;
        }

        const result = await updateLocation(location.name, updateData, updateMask);

        if (result.error) {
            setError(result.error);
        } else {
            onUpdateSuccess(result.data);
            setIsDialogOpen(false);
            toast({
                title: "Success",
                description: "Business information updated successfully.",
            });
        }
        setIsSaving(false);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Card className="shadow-md">
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{name}</CardDescription>
                    </div>
                    <DialogTrigger asChild>
                         <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    </DialogTrigger>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    {categories?.primaryCategory?.displayName && (
                        <div className="flex items-start gap-3">
                            <Briefcase className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                            <span>{categories.primaryCategory.displayName}</span>
                        </div>
                    )}
                    <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                        <span>{fullAddress}</span>
                    </div>
                    {serviceArea?.placeInfos && (
                        <div className="flex items-start gap-3">
                            <MapIcon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                            <span>Serving: {serviceArea.placeInfos.map(p => p.placeName).join(', ')}</span>
                        </div>
                    )}
                    {websiteUri && (
                        <div className="flex items-center gap-3">
                            <Globe className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                            <a href={websiteUri} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                                {websiteUri}
                            </a>
                        </div>
                    )}
                    {phoneNumbers?.primaryPhone && (
                        <div className="flex items-center gap-3">
                            <Phone className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                            <span>{phoneNumbers.primaryPhone}</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Business Information</DialogTitle>
                    <DialogDescription>
                        Make changes to your core business details. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="text-right">Business Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="col-span-3" />
                                    </FormControl>
                                    <FormMessage className="col-span-4" />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="primaryPhone"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="text-right">Phone Number</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="col-span-3" />
                                    </FormControl>
                                    <FormMessage className="col-span-4" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="websiteUri"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="text-right">Website</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="col-span-3" />
                                    </FormControl>
                                    <FormMessage className="col-span-4" />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="addressLine1"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="text-right">Address</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Street and number" className="col-span-3" />
                                    </FormControl>
                                    <FormMessage className="col-span-4" />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="locality"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="text-right">City</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="col-span-3" />
                                    </FormControl>
                                    <FormMessage className="col-span-4" />
                                </FormItem>
                            )}
                        />
                         <div className="grid grid-cols-4 items-center gap-4">
                             <FormLabel className="text-right">State / Postal</FormLabel>
                             <div className="col-span-3 grid grid-cols-2 gap-2">
                                <FormField
                                    control={form.control}
                                    name="administrativeArea"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input {...field} placeholder="State / Province" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="postalCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input {...field} placeholder="Postal Code" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                             </div>
                         </div>
                         <FormField
                            control={form.control}
                            name="regionCode"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel className="text-right">Country Code</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="e.g., US, NL" className="col-span-3" />
                                    </FormControl>
                                    <FormMessage className="col-span-4" />
                                </FormItem>
                            )}
                        />
                        
                         {error && (
                            <Alert variant="destructive" className="col-span-4">
                                <Terminal className="h-4 w-4" />
                                <AlertTitle>API Error</AlertTitle>
                                <AlertDescription><pre className="whitespace-pre-wrap">{error}</pre></AlertDescription>
                            </Alert>
                        )}
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline" disabled={isSaving}>Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

    