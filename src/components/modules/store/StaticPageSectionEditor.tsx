"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StoreStaticPageSection } from "@/lib/storefront/storeStaticPages";

type SectionContentType = "paragraphs" | "bullets";

function getSectionType(section: StoreStaticPageSection): SectionContentType {
  return section.bullets?.length ? "bullets" : "paragraphs";
}

function getSectionLines(section: StoreStaticPageSection): string[] {
  if (section.bullets?.length) return section.bullets;
  return section.paragraphs ?? [""];
}

interface StaticPageSectionEditorProps {
  sections: StoreStaticPageSection[];
  onChange: (sections: StoreStaticPageSection[]) => void;
}

export function StaticPageSectionEditor({ sections, onChange }: StaticPageSectionEditorProps) {
  const updateSection = (index: number, next: StoreStaticPageSection) => {
    onChange(sections.map((section, i) => (i === index ? next : section)));
  };

  const addSection = () => {
    onChange([...sections, { title: "New section", paragraphs: [""] }]);
  };

  const removeSection = (index: number) => {
    onChange(sections.filter((_, i) => i !== index));
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    const next = [...sections];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {sections.length === 0 && (
        <p className="text-sm text-muted-foreground">No sections yet. Add one to build your page content.</p>
      )}

      {sections.map((section, index) => {
        const contentType = getSectionType(section);
        const lines = getSectionLines(section);

        return (
          <div key={index} className="space-y-4 rounded-lg border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">Section {index + 1}</p>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => moveSection(index, -1)}
                  disabled={index === 0}
                  aria-label="Move section up"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => moveSection(index, 1)}
                  disabled={index === sections.length - 1}
                  aria-label="Move section down"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => removeSection(index)}
                  aria-label="Remove section"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Section title</Label>
              <Input
                value={section.title}
                onChange={(e) => updateSection(index, { ...section, title: e.target.value })}
                placeholder="e.g. Shipping rates"
              />
            </div>

            <div className="space-y-2">
              <Label>Content type</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={contentType === "paragraphs" ? "default" : "outline"}
                  onClick={() =>
                    updateSection(index, {
                      title: section.title,
                      paragraphs: lines.length ? lines : [""],
                    })
                  }
                >
                  Paragraphs
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={contentType === "bullets" ? "default" : "outline"}
                  onClick={() =>
                    updateSection(index, {
                      title: section.title,
                      bullets: lines.length ? lines : [""],
                    })
                  }
                >
                  Bullet list
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{contentType === "paragraphs" ? "Paragraphs" : "Bullet points"}</Label>
              <div className="space-y-2">
                {lines.map((line, lineIndex) => (
                  <div key={lineIndex} className="flex gap-2">
                    <Textarea
                      value={line}
                      rows={contentType === "paragraphs" ? 3 : 2}
                      className="min-h-0 flex-1 resize-y"
                      placeholder={
                        contentType === "paragraphs"
                          ? "Write a paragraph..."
                          : "Bullet point text..."
                      }
                      onChange={(e) => {
                        const nextLines = [...lines];
                        nextLines[lineIndex] = e.target.value;
                        updateSection(
                          index,
                          contentType === "paragraphs"
                            ? { title: section.title, paragraphs: nextLines }
                            : { title: section.title, bullets: nextLines },
                        );
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-destructive"
                      onClick={() => {
                        const nextLines = lines.filter((_, i) => i !== lineIndex);
                        updateSection(
                          index,
                          contentType === "paragraphs"
                            ? { title: section.title, paragraphs: nextLines.length ? nextLines : [""] }
                            : { title: section.title, bullets: nextLines.length ? nextLines : [""] },
                        );
                      }}
                      aria-label="Remove line"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const nextLines = [...lines, ""];
                  updateSection(
                    index,
                    contentType === "paragraphs"
                      ? { title: section.title, paragraphs: nextLines }
                      : { title: section.title, bullets: nextLines },
                  );
                }}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add {contentType === "paragraphs" ? "paragraph" : "bullet"}
              </Button>
            </div>
          </div>
        );
      })}

      <Button type="button" variant="outline" onClick={addSection}>
        <Plus className="mr-1 h-4 w-4" />
        Add section
      </Button>
    </div>
  );
}
