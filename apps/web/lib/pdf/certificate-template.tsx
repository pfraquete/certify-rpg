import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register fonts (optional - can use built-in fonts)
// Font.register({
//   family: "Roboto",
//   src: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxP.ttf",
// });

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 40,
    position: "relative",
  },
  border: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    border: "4pt solid #8b5cf6",
    borderRadius: 8,
  },
  innerBorder: {
    position: "absolute",
    top: 25,
    left: 25,
    right: 25,
    bottom: 25,
    border: "1pt solid #c4b5fd",
    borderRadius: 8,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#8b5cf6",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 30,
  },
  body: {
    textAlign: "center",
    marginBottom: 30,
  },
  awardText: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 15,
  },
  recipientName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 20,
    borderBottom: "2pt solid #8b5cf6",
    paddingBottom: 10,
  },
  description: {
    fontSize: 12,
    color: "#4b5563",
    marginBottom: 10,
    lineHeight: 1.6,
    maxWidth: 450,
  },
  campaignInfo: {
    fontSize: 11,
    color: "#6b7280",
    fontStyle: "italic",
    marginTop: 10,
  },
  footer: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  signature: {
    textAlign: "center",
  },
  signatureLine: {
    width: 150,
    borderTop: "1pt solid #9ca3af",
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 10,
    color: "#6b7280",
  },
  date: {
    fontSize: 10,
    color: "#9ca3af",
    marginTop: 20,
    textAlign: "center",
  },
  watermark: {
    position: "absolute",
    fontSize: 80,
    color: "#f3f4f6",
    transform: "rotate(-45deg)",
    opacity: 0.3,
    top: "40%",
    left: "20%",
  },
});

interface CertificateTemplateProps {
  recipientName: string;
  title: string;
  description?: string;
  campaign?: string;
  issuedDate: string;
  issuerName?: string;
}

export function CertificateTemplate({
  recipientName,
  title,
  description,
  campaign,
  issuedDate,
  issuerName = "CertifyRPG",
}: CertificateTemplateProps) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Decorative borders */}
        <View style={styles.border} />
        <View style={styles.innerBorder} />

        {/* Watermark */}
        <Text style={styles.watermark}>CERTIFY RPG</Text>

        {/* Main content */}
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Certificado</Text>
            <Text style={styles.subtitle}>de Participação e Conquista</Text>
          </View>

          <View style={styles.body}>
            <Text style={styles.awardText}>Este certificado é conferido a</Text>
            <Text style={styles.recipientName}>{recipientName}</Text>

            <Text style={styles.description}>{title}</Text>

            {description && (
              <Text style={styles.description}>{description}</Text>
            )}

            {campaign && (
              <Text style={styles.campaignInfo}>Campanha: {campaign}</Text>
            )}
          </View>

          <View style={styles.footer}>
            <View style={styles.signature}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureText}>{issuerName}</Text>
              <Text style={styles.signatureText}>Mestre de Jogo</Text>
            </View>

            <View style={styles.signature}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureText}>Data de Emissão</Text>
              <Text style={styles.signatureText}>{issuedDate}</Text>
            </View>
          </View>

          <Text style={styles.date}>
            Gerado por CertifyRPG • {new Date().toLocaleDateString("pt-BR")}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
