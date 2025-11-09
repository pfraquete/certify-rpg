import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#1a0f0a",
    padding: 40,
    position: "relative",
  },
  border: {
    position: "absolute",
    top: 15,
    left: 15,
    right: 15,
    bottom: 15,
    border: "4pt solid #d4af37",
    borderRadius: 12,
  },
  innerBorder: {
    position: "absolute",
    top: 22,
    left: 22,
    right: 22,
    bottom: 22,
    border: "2pt solid #8b6914",
    borderRadius: 8,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 50,
  },
  header: {
    marginBottom: 30,
    textAlign: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#d4af37",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 4,
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
  },
  subtitle: {
    fontSize: 16,
    color: "#c9b037",
    fontStyle: "italic",
    marginBottom: 40,
  },
  body: {
    textAlign: "center",
    marginBottom: 35,
  },
  awardText: {
    fontSize: 14,
    color: "#d4af37",
    marginBottom: 20,
    fontStyle: "italic",
  },
  recipientName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffd700",
    marginBottom: 25,
    borderBottom: "3pt solid #d4af37",
    paddingBottom: 12,
  },
  description: {
    fontSize: 13,
    color: "#c9b037",
    marginBottom: 12,
    lineHeight: 1.8,
    maxWidth: 500,
  },
  campaignInfo: {
    fontSize: 12,
    color: "#8b6914",
    fontStyle: "italic",
    marginTop: 15,
  },
  footer: {
    marginTop: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  signature: {
    textAlign: "center",
  },
  signatureLine: {
    width: 180,
    borderTop: "2pt solid #d4af37",
    marginBottom: 8,
  },
  signatureText: {
    fontSize: 11,
    color: "#c9b037",
  },
  date: {
    fontSize: 11,
    color: "#8b6914",
    marginTop: 25,
    textAlign: "center",
  },
  watermark: {
    position: "absolute",
    fontSize: 90,
    color: "#2a1f1a",
    transform: "rotate(-45deg)",
    opacity: 0.2,
    top: "40%",
    left: "20%",
  },
  decorativeCorners: {
    position: "absolute",
    color: "#d4af37",
    fontSize: 24,
  },
});

interface FantasyTemplateProps {
  recipientName: string;
  title: string;
  description?: string;
  campaign?: string;
  issuedDate: string;
  issuerName?: string;
}

export function FantasyTemplate({
  recipientName,
  title,
  description,
  campaign,
  issuedDate,
  issuerName = "Grão-Mestre",
}: FantasyTemplateProps) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Decorative borders */}
        <View style={styles.border} />
        <View style={styles.innerBorder} />

        {/* Watermark */}
        <Text style={styles.watermark}>⚔</Text>

        {/* Main content */}
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>⚔ Certificado ⚔</Text>
            <Text style={styles.subtitle}>
              De Bravura e Honra no Reino dos Jogos de Interpretação
            </Text>
          </View>

          <View style={styles.body}>
            <Text style={styles.awardText}>
              Por este pergaminho, certificamos que
            </Text>
            <Text style={styles.recipientName}>{recipientName}</Text>

            <Text style={styles.description}>{title}</Text>

            {description && (
              <Text style={styles.description}>{description}</Text>
            )}

            {campaign && (
              <Text style={styles.campaignInfo}>
                Em memória das aventuras de: {campaign}
              </Text>
            )}
          </View>

          <View style={styles.footer}>
            <View style={styles.signature}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureText}>{issuerName}</Text>
              <Text style={styles.signatureText}>Guardião das Histórias</Text>
            </View>

            <View style={styles.signature}>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureText}>Data da Conquista</Text>
              <Text style={styles.signatureText}>{issuedDate}</Text>
            </View>
          </View>

          <Text style={styles.date}>
            Selado por CertifyRPG • {new Date().toLocaleDateString("pt-BR")}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
