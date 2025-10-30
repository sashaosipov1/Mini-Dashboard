'use client'

import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query'
import axios from 'axios'
import { Box, Button, Flex, Inset, Spinner, Table, Text, TextField } from "@radix-ui/themes";
import { Post } from '../types/post';
import { Ban, ChevronDown, CircleCheck, Radio } from 'lucide-react';
import { Pagination } from './Pagination';
import React from 'react';
import { Dialog, DropdownMenu } from 'radix-ui';


import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
    author: z.string().min(2, "Author name is required"),
    content: z.string().min(10, "Content must be at least 10 characters"),
    title: z.string().min(1, "Title is required"),
});

export default function DataTable() {
    const queryClient = useQueryClient();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    });

    const [selectedItem, setSelectedItem] = React.useState<Post | null>(null);
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [totalPages, setTotalPages] = React.useState<number>(0);
    const [limit, setLimit] = React.useState<number>(10);
    const [status, setStatus] = React.useState<"true" | "false" | "none">("none");
    const [isOpen, setIsOpen] = React.useState(false);

    const { isPending, error, data, isFetching } = useQuery({
        queryKey: ['getPosts', status, currentPage],
        queryFn: async () => {
            const response = await axios.get('/api/proxy', {
                params: {
                    published: status,
                    offset: (currentPage - 1) * limit
                }
            })
            const res = await response.data;
            setLimit(res.pagination.limit)
            setTotalPages(Math.ceil(res.pagination.totalItems / res.pagination.limit))
            return res
        },
    })

    const onPageChange = (page: number) => {
        setCurrentPage(page);
    }

    const handleRowClick = (item: Post) => {
        setSelectedItem(item);
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setSelectedItem(null);
    };

    const updatePostMutation = useMutation({
        mutationFn: async (postData: { id: string; published: boolean; title?: string; content?: string }) => {
            const response = await axios.patch('/api/proxy', postData);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['getPosts'] });
            handleClose();
        }
    });

    const onFormSubmit = (data: any) => {
        console.log(data);
        updatePostMutation.mutate({...data, id: selectedItem!.id})
    }

    if (isPending) return <Spinner size='3' />

    if (error) return 'An error has occurred: ' + error.message

    return (
        <Box>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <Button variant="soft">
                        Statuses
                        <ChevronDown />
                    </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className="z-50 min-w-[8rem] rounded-md border bg-white p-1 shadow-md"
                    >
                        <DropdownMenu.Item
                            className="px-2 py-1.5 text-sm hover:bg-gray-100 cursor-pointer"
                            onClick={setStatus.bind(null, "true")}
                        >True</DropdownMenu.Item>
                        <DropdownMenu.Item
                            className="px-2 py-1.5 text-sm hover:bg-gray-100 cursor-pointer"
                            onClick={setStatus.bind(null, "false")}
                        >False</DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item
                            className="px-2 py-1.5 text-sm hover:bg-gray-100 cursor-pointer"
                            onClick={setStatus.bind(null, "none")}
                        >Clear</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <Table.Root variant="surface" size='3'>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeaderCell>Author</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Content</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Published</Table.ColumnHeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {
                        data.data.map((elem: Post) => {
                            return (
                                <Table.Row key={elem.id} onClick={() => handleRowClick(elem)}>
                                    <Table.RowHeaderCell>{elem.author}</Table.RowHeaderCell>
                                    <Table.Cell>{elem.content}</Table.Cell>
                                    <Table.Cell>{elem.title}</Table.Cell>
                                    <Table.Cell>{elem.published ? <CircleCheck color='green' /> : <Ban color='red' />}</Table.Cell>
                                </Table.Row>
                            )
                        })
                    }
                </Table.Body>
            </Table.Root>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />

            <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
                    <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white p-6 shadow-lg outline-none focus:outline-none">
                        <Dialog.Title className="text-lg font-semibold text-gray-900">Post # {selectedItem?.id}</Dialog.Title>
                        <Dialog.Description className="mt-1 text-sm text-gray-500">
                            Edit this post
                        </Dialog.Description>

                        <Flex direction="column" gap="3" className="mt-4 space-y-4">
                            {/* Форма */}
                            <form onSubmit={handleSubmit(onFormSubmit)} className="mt-4 space-y-4">
                                <div>
                                    <label className="block">
                                        <div className="text-sm font-medium text-gray-500 mb-1">
                                            Author
                                        </div>
                                        <TextField.Root
                                            {...register("author")}
                                            name="author"
                                            defaultValue={selectedItem?.author || ""}
                                            placeholder="Enter a author"
                                            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.author && <p style={{ color: 'red' }}>{errors.author.message}</p>}
                                    </label>
                                </div>

                                <div>
                                    <label className="block">
                                        <div className="text-sm font-medium text-gray-500 mb-1">
                                            Content
                                        </div>
                                        <TextField.Root
                                            {...register("content")}
                                            name="content"
                                            defaultValue={selectedItem?.content || ""}
                                            placeholder="Enter your content"
                                            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.content && <p style={{ color: 'red' }}>{errors.content.message}</p>}
                                    </label>
                                </div>

                                <div>
                                    <label className="block">
                                        <div className="text-sm font-medium text-gray-500 mb-1">
                                            Title
                                        </div>
                                        <TextField.Root
                                            {...register("title")}
                                            name="title"
                                            defaultValue={selectedItem?.title || ""}
                                            placeholder="Enter your title"
                                            className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.title && <p style={{ color: 'red' }}>{errors.title.message}</p>}
                                    </label>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Dialog.Close asChild>
                                        <button
                                            type="button"
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Cancel
                                        </button>
                                    </Dialog.Close>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </Flex>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </Box>
    )
}