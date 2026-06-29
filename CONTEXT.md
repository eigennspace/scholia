# Scholia

A personal knowledge hub for writers and lifelong learners. Combines editorial publishing with personal notebook organization.

## Language

**User**:
A person with a Scholia account.
_Avoid_: Author, member, account

**Note**:
The core content entity. Has a status lifecycle: DRAFT → (SCHEDULED →) PUBLISHED → ARCHIVED.
_Avoid_: Article, document, post, entry

**Story**:
A Note whose status is PUBLISHED. The same entity — only the label changes.
_Avoid_: Article, post

**Status**:
The lifecycle stage of a Note: DRAFT (being written), SCHEDULED (future publication), PUBLISHED (public story), ARCHIVED (hidden from active views, reversible).

**Category**:
A top-level grouping for Notes. Two built-in categories: Knowledge and Work. Mutually exclusive per Note — each Note has exactly one Category.
_Avoid_: Tag, folder, collection, label

**Important**:
A boolean flag on a Note, independent of Category. Any Note can be marked Important regardless of its Category.
_Avoid_: Priority, starred, pinned

**Collection**:
A curated grouping of Notes, orthogonal to Categories. A Note can belong to zero or more Collections. The Reading List is a default Collection.
_Avoid_: Playlist, folder, category

**Reading List**:
The default Collection created for every User. Bookmarking a Note adds it to the Reading List.

**Bookmark**:
The action of adding a Note to the Reading List Collection. Not a separate entity.
_Avoid_: Save, favorite, bookmarking (as a noun)

**Template**:
A pre-structured Note used as a starting point. Has `isTemplate` flag set to true. Created as seed data, duplicated by the User to create a real Note. Not user-editable.
_Avoid_: Preset, starter, scaffold

**Tag**:
A freeform label attached to a Note. Flat taxonomy (no hierarchy). Zero or more per Note.

**Reading Time**:
An integer (minutes) computed from word count at save time. Formula: ceil(wordCount / 225).
