# AGENTS

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>` (run in your shell)
  - For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete the task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>

<available_skills>

<skill>
<name>libreoffice-calc</name>
<description>Use when creating, editing, formatting, exporting, or extracting LibreOffice Calc (.ods) spreadsheets via UNO, including session-based cell and range edits, sheets, named ranges, validation, charts, patch workflows, and snapshots.</description>
<location>project</location>
</skill>

<skill>
<name>libreoffice-impress</name>
<description>Use when creating, editing, formatting, or extracting LibreOffice Impress (.odp) presentations via UNO, including session-based slide edits, structured targets, lists, tables, charts, media, notes, master pages, patch workflows, and snapshots.</description>
<location>project</location>
</skill>

<skill>
<name>libreoffice-writer</name>
<description>Use when creating, editing, formatting, exporting, or extracting LibreOffice Writer (.odt) documents via UNO, including session-based edits, structured text targets, tables, images, lists, patch workflows, and snapshots.</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
