# Webflow asset upload, working recipe

Three round trips. Step 3 is what registers the bytes against the asset record; skip it and
the asset exists but serves nothing.

## 1. Hash and create

```bash
md5 -q myfile.webp      # macOS.  Linux: md5sum myfile.webp | cut -d' ' -f1
```

Call `data_assets_tool` → `create_asset` with `site_id`, `file_name`, `file_hash`.
Batch several files into one call. Keep the whole response: you need `uploadUrl`,
every field of `uploadDetails`, and the returned asset `id`.

## 2. POST the bytes to S3

Every `uploadDetails` property becomes a form field, then the file last. Note the field
names are the S3 casing (`Policy`, `X-Amz-Signature`), not the camelCase the tool returns.

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST "https://webflow-prod-assets.s3.amazonaws.com/" \
  -F "acl=public-read" \
  -F "bucket=webflow-prod-assets" \
  -F "X-Amz-Algorithm=AWS4-HMAC-SHA256" \
  -F "X-Amz-Credential=$CREDENTIAL" \
  -F "X-Amz-Date=$AMZDATE" \
  -F "key=$KEY" \
  -F "Policy=$POLICY" \
  -F "X-Amz-Signature=$SIGNATURE" \
  -F "success_action_status=201" \
  -F "Content-Type=$CONTENT_TYPE" \
  -F "cache-control=max-age=31536000" \
  -F "file=@myfile.webp;type=$CONTENT_TYPE"
```

**201 is success.** Anything else means the policy expired (they are short-lived, roughly an
hour) or a field is missing. Re-run `create_asset` for a fresh policy rather than editing
the signature.

The presigned POST goes to S3, not to the Webflow API, so it is not subject to the MCP rate
limit and it needs no auth header.

## 3. Finalize

Call `create_asset` again with the identical `file_name` and `file_hash`. It returns the
same asset `id`. The asset is now live.

## Verify

```
https://cdn.prod.website-files.com/<siteId>/<assetId>_<filename>
```

Fetch it and check status, content type and byte size against the file you uploaded.
`get_asset` reports `size: 0` even for healthy assets, so it is not a verification.

## Binding

Images inserted through `whtml_builder` are never bound. After inserting:

```
data_element_tool → set_image_asset { id: <element id object>, image_asset_id: <asset id> }
data_element_tool → set_attributes  { id: ..., attributes: [{name: "altText", value: "..."}] }
```

## Formats

- Photography: WebP, quality 84-88, `method=6`. Above q88 the file doubles for no visible gain.
- Logos and marks: SVG. Check the artboard is tight to the mark. Exported SVGs often carry a
  background plate (a `<rect>` filling the viewBox), which makes the logo look tiny at any CSS
  height because most of the box is padding. Strip the rect or re-export the group alone.
- Sizing: target 2x the largest CSS width the element will occupy. A full-bleed hero at 1920
  CSS px wants roughly 3400px wide, not 4800.
