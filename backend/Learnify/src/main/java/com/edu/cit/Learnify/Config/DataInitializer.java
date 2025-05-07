package com.edu.cit.Learnify.Config;

import com.edu.cit.Learnify.Entity.DialogNode;
import com.edu.cit.Learnify.Repository.DialogNodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final DialogNodeRepository dialogNodeRepository;

    @Override
    public void run(String... args) {
        if (dialogNodeRepository.count() == 0) {
            // Initialize with sample dialog nodes for a nervous system lesson

            // Node 1: Introduction
            DialogNode node1 = new DialogNode();
            node1.setId("intro");
            node1.setText("Welcome to our lesson on the nervous system! I'm Dr. Neura, and I'll be your guide through this fascinating journey.");
            node1.setCharacter("doctor");
            node1.setBackground("laboratory");
            node1.setCharacterImage("doctor_neutral");

            DialogNode.DialogChoice choice1_1 = new DialogNode.DialogChoice();
            choice1_1.setText("I'm excited to learn about the nervous system!");
            choice1_1.setNextNodeId("overview");

            DialogNode.DialogChoice choice1_2 = new DialogNode.DialogChoice();
            choice1_2.setText("Can we start with the basic structure?");
            choice1_2.setNextNodeId("structure");

            node1.setChoices(Arrays.asList(choice1_1, choice1_2));
            node1.setEndNode(false);

            // Node 2: Overview
            DialogNode node2 = new DialogNode();
            node2.setId("overview");
            node2.setText("The nervous system is the body's command center. It consists of the central nervous system (brain and spinal cord) and the peripheral nervous system, which connects the CNS to the rest of the body.");
            node2.setCharacter("doctor");
            node2.setBackground("classroom");
            node2.setCharacterImage("doctor_explaining");

            DialogNode.DialogChoice choice2_1 = new DialogNode.DialogChoice();
            choice2_1.setText("Tell me more about the central nervous system.");
            choice2_1.setNextNodeId("cns");

            DialogNode.DialogChoice choice2_2 = new DialogNode.DialogChoice();
            choice2_2.setText("I'd like to learn about the peripheral nervous system.");
            choice2_2.setNextNodeId("pns");

            node2.setChoices(Arrays.asList(choice2_1, choice2_2));
            node2.setEndNode(false);

            // Node 3: Structure
            DialogNode node3 = new DialogNode();
            node3.setId("structure");
            node3.setText("The nervous system is made up of neurons, which are specialized cells that transmit signals. These neurons form networks that allow information to travel throughout your body.");
            node3.setCharacter("doctor");
            node3.setBackground("neuron_diagram");
            node3.setCharacterImage("doctor_pointing");

            DialogNode.DialogChoice choice3_1 = new DialogNode.DialogChoice();
            choice3_1.setText("How do neurons communicate?");
            choice3_1.setNextNodeId("neuron_communication");

            DialogNode.DialogChoice choice3_2 = new DialogNode.DialogChoice();
            choice3_2.setText("What are the parts of a neuron?");
            choice3_2.setNextNodeId("neuron_parts");

            node3.setChoices(Arrays.asList(choice3_1, choice3_2));
            node3.setEndNode(false);

            // Node 4: Central Nervous System
            DialogNode node4 = new DialogNode();
            node4.setId("cns");
            node4.setText("The central nervous system consists of the brain and spinal cord. The brain processes information and controls conscious functions, while the spinal cord serves as a highway for signals between the brain and the rest of the body.");
            node4.setCharacter("doctor");
            node4.setBackground("brain_diagram");
            node4.setCharacterImage("doctor_enthusiastic");

            DialogNode.DialogChoice choice4_1 = new DialogNode.DialogChoice();
            choice4_1.setText("What are the main parts of the brain?");
            choice4_1.setNextNodeId("brain_parts");

            DialogNode.DialogChoice choice4_2 = new DialogNode.DialogChoice();
            choice4_2.setText("Return to the main menu");
            choice4_2.setNextNodeId("intro");

            node4.setChoices(Arrays.asList(choice4_1, choice4_2));
            node4.setEndNode(false);

            // Node 5: Peripheral Nervous System
            DialogNode node5 = new DialogNode();
            node5.setId("pns");
            node5.setText("The peripheral nervous system includes all the nerves that branch out from the CNS. It has two main divisions: the somatic nervous system (voluntary control) and the autonomic nervous system (involuntary functions).");
            node5.setCharacter("doctor");
            node5.setBackground("body_nerves");
            node5.setCharacterImage("doctor_teaching");

            DialogNode.DialogChoice choice5_1 = new DialogNode.DialogChoice();
            choice5_1.setText("Tell me about the autonomic nervous system.");
            choice5_1.setNextNodeId("ans");

            DialogNode.DialogChoice choice5_2 = new DialogNode.DialogChoice();
            choice5_2.setText("Return to the main menu");
            choice5_2.setNextNodeId("intro");

            node5.setChoices(Arrays.asList(choice5_1, choice5_2));
            node5.setEndNode(false);

            // More nodes as needed
            DialogNode node6 = new DialogNode();
            node6.setId("neuron_communication");
            node6.setText("Neurons communicate through electrochemical signals. When a neuron is stimulated, it generates an electrical impulse that travels down its axon. At the synapse, chemical messengers called neurotransmitters carry the signal to the next neuron.");
            node6.setCharacter("doctor");
            node6.setBackground("synapse_closeup");
            node6.setCharacterImage("doctor_detailed");
            node6.setChoices(Collections.singletonList(new DialogNode.DialogChoice() {{
                setText("That's fascinating! Let's return to the main menu.");
                setNextNodeId("intro");
            }}));
            node6.setEndNode(false);

            // Save all nodes
            List<DialogNode> nodes = Arrays.asList(node1, node2, node3, node4, node5, node6);
            dialogNodeRepository.saveAll(nodes);
        }
    }

}