import { Container, Title, Table, Pagination, Paper,} from '@mantine/core';
import { useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

function History() {

  const diningHistory = [
    { id: 1, location: 'Sushi Zanmai', date: '2025-06-01' },
    { id: 2, location: 'Burger Joint', date: '2025-05-30' },
    { id: 3, location: 'Pasta Palace', date: '2025-05-28' },
    { id: 4, location: 'Dim Sum Delight', date: '2025-05-26' },
    { id: 5, location: 'Taco Fiesta', date: '2025-05-25' },
    { id: 6, location: 'Curry House', date: '2025-05-22' },
    { id: 7, location: 'Pho Haven', date: '2025-05-20' },
    { id: 8, location: 'Steakhouse Prime', date: '2025-05-18' },
    { id: 9, location: 'Ramen Street', date: '2025-05-15' },
    { id: 10, location: 'Mediterranean Grill', date: '2025-05-12' },
    { id: 11, location: 'Vegan Paradise', date: '2025-05-10' },
    { id: 12, location: 'Korean BBQ House', date: '2025-05-08' },
    { id: 13, location: 'French Bistro', date: '2025-05-06' },
    { id: 14, location: 'Indian Spice', date: '2025-05-04' },
    { id: 15, location: 'Western Diner', date: '2025-05-02' },

  ];

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(diningHistory.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = diningHistory.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <Navbar />
      <Container size="md" my="xl">
        <Title align="center" mb="lg">
          Dining History
        </Title>
        <Paper withBorder shadow="sm" p="md" radius="md">
          <Table highlightOnHover>
            <thead>
              <tr>
                <th>#</th>
                <th>Location</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((entry, index) => (
                <tr key={entry.id}>
                  <td>{startIndex + index + 1}</td>
                  <td>{entry.location}</td>
                  <td>{entry.date}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination
            page={currentPage}
            onChange={setCurrentPage}
            total={totalPages}
            position="right"
            mt="md"
          />
        </Paper>
      </Container>
      <Footer />
    </>
  );
}

export default History;