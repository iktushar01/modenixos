"use client";

import { useEffect, useMemo, useState } from "react";
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
import { ChevronDown, ChevronRight, Eye, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
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
import { Category } from "@/types/store.types";
import { reorderCategorySiblings } from "@/lib/catalog/categoryTree";
import { CategoryThumbnail } from "./CategoryFormDialog";
import { cn } from "@/lib/utils";

type CategoryRow = {
  category: Category;
  parentId: string | null;
  isParent: boolean;
};

function buildVisibleRows(tree: Category[], expanded: Record<string, boolean>): CategoryRow[] {
  const rows: CategoryRow[] = [];

  for (const parent of tree) {
    const hasChildren = (parent.children?.length ?? 0) > 0;
    rows.push({ category: parent, parentId: null, isParent: true });
    const isOpen = expanded[parent.id] ?? hasChildren;
    if (isOpen && parent.children) {
      for (const child of parent.children) {
        rows.push({ category: child, parentId: parent.id, isParent: false });
      }
    }
  }

  return rows;
}

interface SortableCategoryRowProps {
  row: CategoryRow;
  sortable: boolean;
  hasChildren: boolean;
  isOpen: boolean;
  onToggleExpanded: (id: string) => void;
  onCreateSub: (parent: Category) => void;
  onView: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

function SortableCategoryRow({
  row,
  sortable,
  hasChildren,
  isOpen,
  onToggleExpanded,
  onCreateSub,
  onView,
  onEdit,
  onDelete,
}: SortableCategoryRowProps) {
  const { category, isParent } = row;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
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
        isParent ? "bg-muted/20" : "bg-background",
        isDragging && "z-10 opacity-90 shadow-md ring-1 ring-primary/20",
      )}
    >
      <TableCell className="w-10 p-2">
        {sortable ? (
          <button
            type="button"
            className="flex h-9 w-9 cursor-grab items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:cursor-grabbing"
            aria-label={`Drag to reorder ${category.name}`}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ) : (
          <span className="inline-block w-9" />
        )}
      </TableCell>
      <TableCell className={cn(!isParent && "pl-8")}>
        <CategoryThumbnail category={category} compact={!isParent} />
      </TableCell>
      <TableCell className={cn(isParent && "font-medium")}>
        <div className="flex items-center gap-2">
          {isParent ? (
            hasChildren ? (
              <button
                type="button"
                onClick={() => onToggleExpanded(category.id)}
                className="rounded p-0.5 hover:bg-muted"
                aria-label={isOpen ? "Collapse subcategories" : "Expand subcategories"}
              >
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            ) : (
              <span className="inline-block w-5" />
            )
          ) : (
            <span className="pl-6 text-muted-foreground">↳</span>
          )}
          <span>{category.name}</span>
          {isParent && hasChildren && (
            <span className="text-xs text-muted-foreground">({category.children?.length} sub)</span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">{category.slug}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          {isParent && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="hidden h-8 px-2 text-xs sm:inline-flex"
                onClick={() => onCreateSub(category)}
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Subcategory
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                onClick={() => onCreateSub(category)}
                aria-label="Add subcategory"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" onClick={() => onView(category)} aria-label={`View ${category.name}`}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(category.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

interface CategoriesSortableTableProps {
  tree: Category[];
  sortable: boolean;
  expanded: Record<string, boolean>;
  onToggleExpanded: (id: string) => void;
  onReorder: (parentId: string | null, categoryIds: string[]) => void;
  onCreateSub: (parent: Category) => void;
  onView: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export function CategoriesSortableTable({
  tree,
  sortable,
  expanded,
  onToggleExpanded,
  onReorder,
  onCreateSub,
  onView,
  onEdit,
  onDelete,
}: CategoriesSortableTableProps) {
  const [items, setItems] = useState(tree);

  useEffect(() => {
    setItems(tree);
  }, [tree]);

  const rows = useMemo(() => buildVisibleRows(items, expanded), [items, expanded]);
  const sortableIds = useMemo(() => rows.map((row) => row.category.id), [rows]);
  const rowById = useMemo(() => new Map(rows.map((row) => [row.category.id, row])), [rows]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeRow = rowById.get(String(active.id));
    const overRow = rowById.get(String(over.id));
    if (!activeRow || !overRow) return;
    if (activeRow.parentId !== overRow.parentId) return;

    const siblings = rows.filter((row) => row.parentId === activeRow.parentId).map((row) => row.category);
    const oldIndex = siblings.findIndex((c) => c.id === active.id);
    const newIndex = siblings.findIndex((c) => c.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(siblings, oldIndex, newIndex);
    const nextTree = reorderCategorySiblings(items, activeRow.parentId, reordered.map((c) => c.id));
    setItems(nextTree);
    onReorder(activeRow.parentId, reordered.map((c) => c.id));
  };

  const tableHeader = (
    <TableHeader>
      <TableRow>
        <TableHead className="w-10" aria-label="Reorder" />
        <TableHead className="w-[60px]">Image</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Slug</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );

  const tableRows = rows.map((row) => {
    const hasChildren = (row.category.children?.length ?? 0) > 0;
    const isOpen = expanded[row.category.id] ?? hasChildren;

    return (
      <SortableCategoryRow
        key={row.category.id}
        row={row}
        sortable={sortable}
        hasChildren={hasChildren}
        isOpen={isOpen}
        onToggleExpanded={onToggleExpanded}
        onCreateSub={onCreateSub}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  });

  return (
    <DashboardTable label="Categories" count={rows.length}>
      {sortable ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <Table>
            {tableHeader}
            <TableBody>
              <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                {tableRows}
              </SortableContext>
            </TableBody>
          </Table>
        </DndContext>
      ) : (
        <Table>
          {tableHeader}
          <TableBody>{tableRows}</TableBody>
        </Table>
      )}
    </DashboardTable>
  );
}
