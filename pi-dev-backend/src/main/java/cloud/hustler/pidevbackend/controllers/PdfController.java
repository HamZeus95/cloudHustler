package cloud.hustler.pidevbackend.controllers;

import org.springframework.web.bind.annotation.*;
import org.w3c.tidy.Tidy;
import org.xhtmlrenderer.pdf.ITextRenderer;
import java.io.ByteArrayOutputStream;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.Map;

@RestController

public class PdfController {

    @PostMapping("/generate-pdf")
    public byte[] generatePdf(@RequestBody Map<String, String> request) throws Exception {
        String html = request.get("html");

        // First clean with JTidy for thorough XHTML compliance
        html = cleanHtmlWithTidy(html);

        // Then apply additional fixes if needed
        html = ensureXmlDeclaration(html);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ITextRenderer renderer = new ITextRenderer();

        // Configure renderer (optional)
        renderer.getSharedContext().setPrint(true);
        renderer.getSharedContext().setInteractive(false);

        renderer.setDocumentFromString(html);
        renderer.layout();
        renderer.createPDF(outputStream);
        renderer.finishPDF();

        return outputStream.toByteArray();
    }

    private String cleanHtmlWithTidy(String html) {
        try {
            Tidy tidy = new Tidy();
            tidy.setXHTML(true);
            tidy.setShowWarnings(false);
            tidy.setQuiet(true);
            tidy.setMakeClean(true);
            tidy.setFixComments(true);
            tidy.setFixBackslash(true);
            tidy.setLogicalEmphasis(true);

            StringReader reader = new StringReader(html);
            StringWriter writer = new StringWriter();
            tidy.parse(reader, writer);
            return writer.toString();
        } catch (Exception e) {
            // Fallback to basic cleaning if JTidy fails
            return basicHtmlClean(html);
        }
    }

    private String basicHtmlClean(String html) {
        // Basic replacements for common issues
        return html
                .replaceAll("<(input|img|br|hr)([^>]*)/>", "<$1$2></$1>")
                .replaceAll("&(?!(amp|lt|gt|quot|apos);)", "&amp;");
    }

    private String ensureXmlDeclaration(String html) {
        if (!html.contains("<?xml")) {
            return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                    "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" " +
                    "\"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n" +
                    "<html xmlns=\"http://www.w3.org/1999/xhtml\">" + html + "</html>";
        }
        return html;
    }
}