"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Eye, GripVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardTable } from "@/components/shared/DashboardTable";
import { Collection } from "@/types/store.types";
import { CollectionThumbnail } from "./CollectionFormDialog";
import { cn } from "@/lib/utils";

interface SortableCollectionRowProps {
  collection: Collection;
  sortable: boolean;
  onView: (collection: Collection) => void;
  onEdit: (collection: Collection) => void;
  onDelete: (id: string) => void;
}

function SortableCollectionRow({
  collection,
  sortable,
  onView,
  onEdit,
  onDelete,
}: SortableCollectionRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: collection.id,
    disabled: !sortable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-background",
        isDragging && "z-10 opacity-90 shadow-md ring-1 ring-primary/20",
      )}
    >
      <TableCell className="w-10 p-2">
        {sortable ? (
          <button
            type="button"
            className="flex h-9 w-9 cursor-grab items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:cursor-grabbing"
            aria-label={`Drag to reorder ${collection.name}`}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ) : (
          <span className="inline-block w-9" />
        )}
      </TableCell>
      <TableCell>
        <CollectionThumbnail collection={collection} />
      </TableCell>
      <TableCell className="font-medium">{collection.name}</TableCell>
      <TableCell className="text-muted-foreground">{collection.slug}</TableCell>
      <TableCell>{collection.isFeatured ? "Yes" : "No"}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(collection)}
            aria-label={`View ${collection.name}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(collection)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(collection.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

interface CollectionsSortableTableProps {
  collections: Collection[];
  sortable: boolean;
  onReorder: (collectionIds: string[]) => void;
  onView: (collection: Collection) => void;
  onEdit: (collection: Collection) => void;
  onDelete: (id: string) => void;
}

export function CollectionsSortableTable({
  collections,
  sortable,
  onReorder,
  onView,
  onEdit,
  onDelete,
}: CollectionsSortableTableProps) {
  const [items, setItems] = useState(collections);

  useEffect(() => {
    setItems(collections);
  }, [collections]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((c) => c.id === active.id);
    const newIndex = items.findIndex((c) => c.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    onReorder(next.map((c) => c.id));
  };

  const tableHeader = (
    <TableHeader>
      <TableRow>
        <TableHead className="w-10" aria-label="Reorder" />
        <TableHead className="w-[60px]">Image</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Slug</TableHead>
        <TableHead>Featured</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );

  const rows = items.map((collection) => (
    <SortableCollectionRow
      key={collection.id}
      collection={collection}
      sortable={sortable}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  ));

  return (
    <DashboardTable label="Collections" count={items.length}>
      {sortable ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <Table>
            {tableHeader}
            <TableBody>
              <SortableContext items={items.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                {rows}
              </SortableContext>
            </TableBody>
          </Table>
        </DndContext>
      ) : (
        <Table>
          {tableHeader}
          <TableBody>{rows}</TableBody>
        </Table>
      )}
    </DashboardTable>
  );
}
