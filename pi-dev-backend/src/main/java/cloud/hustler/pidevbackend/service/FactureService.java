package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.*;
import cloud.hustler.pidevbackend.repository.DeliverDriverRepository;
import cloud.hustler.pidevbackend.repository.FactureRepository;
import cloud.hustler.pidevbackend.repository.LivraisonRepository;
import cloud.hustler.pidevbackend.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.*;
@Service
public class FactureService implements IFactureService{

    @Autowired
    private FactureRepository factureRepository;
    @Autowired
    private LivraisonRepository livraisonRepository;
    @Autowired
    private DeliverDriverRepository deliverDriverRepository;

    public Facture creerFacture(Facture facture) {
        Livraison lastLivraison = livraisonRepository.findTopByOrderByIdDesc();

         // Associer la dernière livraison automatiquement
            return factureRepository.save(facture); // Sauvegarder avec les autres champs déjà fournis

    }



    public List<Facture> getAllFactures() {
        return factureRepository.findAll();
    }

    public Optional<Facture> getFactureById(Long id) {
        return factureRepository.findById(id);
    }
    public Facture updateFacture(Long id, Facture facture) {
        Facture existingFacture = factureRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Facture not found"));


        return factureRepository.save(existingFacture);

    }

    public void deleteFacture(Long id) {
        Optional<Facture> facture = factureRepository.findById(id);
        if (facture.isPresent()) {
            factureRepository.delete(facture.get());
        } else {
            throw new EntityNotFoundException("Facture not found with id " + id);
        }
    }
    /*@Transactional
    public void marquerCommePayee(Long id) {
        // Récupérer la facture à partir de l'ID
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Facture non trouvée pour l'ID " + id));

        // Vérifier si la facture n'est pas déjà payée
        if ("PAYÉ".equals(facture.getStatut())) {
            throw new IllegalStateException("La facture est déjà marquée comme payée.");
        }

        // Modifier le statut de la facture
        facture.setStatut("PAYÉ");

        // Sauvegarder les modifications dans la base de données
        factureRepository.save(facture);
    }*/


    public void marquerCommeAnnulee(Long id) {
        // Récupérer la facture à partir de l'ID
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Facture non trouvée pour l'ID " + id));

        // Vérifier si la facture n'est pas déjà payée
        if ("Annulée".equals(facture.getStatut())||"ANNULÉE".equals(facture.getStatut())) {
            throw new IllegalStateException("La facture est déjà marquée comme annulée.");
        }

        // Modifier le statut de la facture
        facture.setStatut("Cancelled");

        // Sauvegarder les modifications dans la base de données
        factureRepository.save(facture);

    }

    @Override
    public List<Facture> findByLivraisonOrderConsumerUuid(UUID uuid) {
        return factureRepository.findByLivraisonOrderConsumerUuid(uuid);
    }

    @Override
    public List<DeliveryDriver> findDeliveryDriverByIsAvailable(boolean isAvailable) {
        return deliverDriverRepository.findDeliveryDriverByIsAvailable(isAvailable);
    }
    @PersistenceContext
    private EntityManager entityManager;

    public List<Order> getAllOrders() {
        return entityManager.createQuery("SELECT o FROM Order o", Order.class)
                .getResultList();
    }

   /* @Override
    public List<Facture> findAllByLivraison_Order_Consumer_Uuid_user(UUID uuid_user) {
        return factureRepository.findAllByLivraison_Order_Consumer_Uuid_user(uuid_user);
    }*/


    private final String API_KEY = "5b3ce3597851110001cf6248ec4e8d3388d446e689cae8efed77351e"; // Remplace par ta clé API gratuite

    public int getEstimatedTime(String start, String end) throws IOException {
        String urlStr = String.format(
                "https://api.openrouteservice.org/v2/directions/driving-car?api_key=%s&start=%s&end=%s",
                API_KEY,
                URLEncoder.encode(start, "UTF-8"),
                URLEncoder.encode(end, "UTF-8")
        );

        URL url = new URL(urlStr);
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("GET");

        BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
        String inputLine;
        StringBuilder response = new StringBuilder();
        while ((inputLine = in.readLine()) != null) {
            response.append(inputLine);
        }
        in.close();

        JSONObject json = new JSONObject(response.toString());
        int durationInSeconds = json
                .getJSONArray("features").getJSONObject(0)
                .getJSONObject("properties").getJSONArray("segments").getJSONObject(0)
                .getInt("duration");

        return durationInSeconds / 60; // Convertir en minutes
    }
}
