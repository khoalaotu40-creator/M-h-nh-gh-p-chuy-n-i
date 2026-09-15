# GitHub Actions & Bash Scripting Guidelines

## Context
Best practices for handling complex bash operations and API calls inside GitHub Actions workflows.

## 1. Handling Large Payloads (ARG_MAX Limit)
- **Problem**: When passing huge string variables (like Git diffs) as command-line arguments (e.g., `jq --arg prompt "$HUGE_VAR"`), Linux bash throws `/usr/bin/jq: Argument list too long` or `exit code 126`.
- **Solution for JQ**: Use the `--rawfile` parameter.
  ```bash
  jq -n --arg model "gpt-4o" --rawfile my_text /tmp/large_file.txt '{model: $model, content: $my_text}' > /tmp/payload.json
  ```
- **Solution for cURL**: Never use `-d "$HUGE_JSON_VAR"`. Always write the payload to a physical file and reference it with `@`.
  ```bash
  curl -X POST https://api.example.com -H "Content-Type: application/json" -d @/tmp/payload.json
  ```

## 2. Multi-line Strings to GITHUB_ENV
- **Problem**: Standard `echo "VAR=$VALUE" >> $GITHUB_ENV` breaks if `$VALUE` contains newlines (like Markdown reviews).
- **Solution**: Use EOF delimiters with a random boundary to safely write multi-line content.
  ```bash
  EOF=$(dd if=/dev/urandom bs=15 count=1 status=none | base64)
  echo "MY_VAR<<$EOF" >> $GITHUB_ENV
  echo "$MULTILINE_CONTENT" >> $GITHUB_ENV
  echo "$EOF" >> $GITHUB_ENV
  ```

## 3. Safe Exit Codes
- Wrap commands that might fail but shouldn't stop the workflow with `|| EXIT_STATUS=$?`.
- Check `$EXIT_STATUS` to gracefully handle network or API errors.
