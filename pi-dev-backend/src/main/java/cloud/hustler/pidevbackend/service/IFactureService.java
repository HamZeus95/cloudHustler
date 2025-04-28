package cloud.hustler.pidevbackend.service;

import cloud.hustler.pidevbackend.entity.DeliveryDriver;
import cloud.hustler.pidevbackend.entity.Facture;
import cloud.hustler.pidevbackend.entity.User;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IFactureService {
    Facture creerFacture(Facture facture);
    List<Facture> getAllFactures();
    Optional<Facture> getFactureById(Long id);
    public Facture updateFacture(Long id, Facture facture);
    public void deleteFacture(Long id);
   // public void marquerCommePayee(Long id) ;
    public void marquerCommeAnnulee(Long id) ;
   // public List<Facture> findAllByLivraison_Order_Consumer_Uuid_user(UUID uuid_user);
    public List<Facture> findByLivraisonOrderConsumerUuid(@Param("uuid") UUID uuid);
    public List<DeliveryDriver> findDeliveryDriverByIsAvailable(boolean isAvailable);



}